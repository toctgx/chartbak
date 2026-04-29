"""
병갔왔 - 네이버 카페 공개 게시글 수집기
⚠️  내부 개발/테스트 전용 | 런칭 전 카페 운영자 동의 필수
"""

import asyncio
import json
import random
import re
import time
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright

OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

# 수집 대상 카페 (카페명과 검색어)
TARGETS = [
    {"cafe_url": "https://cafe.naver.com/cancerline",     "disease_id": "breast_cancer",  "name": "유방암"},
    {"cafe_url": "https://cafe.naver.com/diabeteskorea",  "disease_id": "diabetes",        "name": "당뇨"},
    {"cafe_url": "https://cafe.naver.com/lupuskorea",     "disease_id": "lupus",           "name": "루푸스"},
    {"cafe_url": "https://cafe.naver.com/ccccc",          "disease_id": "crohns",          "name": "크론병"},
    {"cafe_url": "https://cafe.naver.com/parkinsonkorea", "disease_id": "parkinsons",      "name": "파킨슨"},
]

MAX_PER_CAFE = 20
DELAY = (4, 8)  # 요청 간격 (초)

PII_PATTERNS = [
    (r"\d{2,3}-\d{3,4}-\d{4}", "[연락처]"),
    (r"[가-힣]{2,4}(병원|의원|클리닉|센터)", "[병원명]"),
    (r"[가-힣]{2,4}\s*(교수님?|원장님?|선생님)", "[의료진명]"),
]

def clean(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    for pat, repl in PII_PATTERNS:
        text = re.sub(pat, repl, text)
    return text


async def get_public_posts(page, target: dict) -> list:
    posts = []
    print(f"\n🔍 [{target['name']}] 수집 시작...")

    try:
        await page.goto(target["cafe_url"], wait_until="domcontentloaded", timeout=20000)
        await asyncio.sleep(random.uniform(*DELAY))

        # 로그인 요구 확인
        content = await page.content()
        if "로그인" in content and "가입" not in content:
            print(f"  ⛔ 비공개 카페 — 스킵")
            return []

        # iframe 내부 게시글 목록 접근
        main_frame = None
        for frame in page.frames:
            if "ArticleList" in frame.url or "cafe.naver.com" in frame.url and frame != page.main_frame:
                main_frame = frame
                break

        target_frame = main_frame or page.main_frame

        # 게시글 링크 수집
        links = await target_frame.eval_on_selector_all(
            "a[href*='ArticleRead'], a.article, .article-title a",
            "els => els.map(el => ({href: el.href, title: el.innerText.trim()}))"
        )

        print(f"  발견: {len(links)}개 링크")

        for i, link in enumerate(links[:MAX_PER_CAFE]):
            href = link.get("href", "")
            title = clean(link.get("title", ""))
            if not href or not title:
                continue

            # 상세 본문 수집
            try:
                await page.goto(href, wait_until="domcontentloaded", timeout=15000)
                await asyncio.sleep(random.uniform(*DELAY))

                # iframe에서 본문 찾기
                body_text = ""
                for frame in page.frames:
                    for sel in [".se-main-container", ".article_viewer", "#tbody", ".ArticleContentBox"]:
                        try:
                            el = await frame.query_selector(sel)
                            if el:
                                body_text = await el.inner_text()
                                if len(body_text) > 30:
                                    break
                        except:
                            pass
                    if body_text:
                        break

                if len(body_text) < 30:
                    continue

                body_text = clean(body_text)

                post = {
                    "id": f"{target['disease_id']}_{int(time.time())}_{i}",
                    "disease_id": target["disease_id"],
                    "disease_name": target["name"],
                    "source": "naver_cafe",
                    "source_cafe": target["cafe_url"].split("/")[-1],
                    "title": title,
                    "content": body_text[:2000],  # 최대 2000자
                    "crawled_at": datetime.now().isoformat(),
                    # 작성자 정보 미수집
                }
                posts.append(post)
                print(f"  [{i+1}] ✅ {title[:40]}")

            except Exception as e:
                print(f"  [{i+1}] ⚠️ {e}")

            await asyncio.sleep(random.uniform(*DELAY))

    except Exception as e:
        print(f"  ❌ 오류: {e}")

    return posts


async def main():
    print("=" * 55)
    print("🏥 병갔왔 네이버 카페 수집기")
    print("   ⚠️  내부 테스트 전용 | 런칭 전 운영자 동의 필수")
    print("=" * 55)

    all_posts = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
            locale="ko-KR",
            viewport={"width": 1280, "height": 900},
        )
        page = await ctx.new_page()

        for target in TARGETS:
            posts = await get_public_posts(page, target)
            all_posts.extend(posts)
            print(f"  → {target['name']}: {len(posts)}개 수집")
            await asyncio.sleep(random.uniform(5, 12))

        await browser.close()

    # 저장
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out = OUTPUT_DIR / f"posts_{ts}.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"total": len(all_posts), "posts": all_posts}, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 완료: {len(all_posts)}개 → {out}")

    # 질환별 요약
    from collections import Counter
    dist = Counter(p["disease_name"] for p in all_posts)
    print("\n📊 질환별 수집량:")
    for k, v in dist.items():
        print(f"   {k}: {v}개")


if __name__ == "__main__":
    asyncio.run(main())
