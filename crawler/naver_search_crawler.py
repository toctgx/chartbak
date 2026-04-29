"""
병갔왔 - 네이버 검색 기반 환자 후기 수집기
네이버 검색 결과에서 공개된 카페 글 / 블로그 글 수집
⚠️  내부 개발/테스트 전용 | 런칭 전 운영자 동의 필수
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

# 검색 쿼리 (질환별 실제 환자 후기성 키워드)
SEARCH_QUERIES = [
    {"query": "유방암 항암 치료 후기 부작용 site:cafe.naver.com", "disease_id": "breast_cancer",  "name": "유방암"},
    {"query": "유방암 의사에게 못한말 진료 경험",                 "disease_id": "breast_cancer",  "name": "유방암"},
    {"query": "당뇨 인슐린 일상 관리 후기 site:cafe.naver.com",  "disease_id": "diabetes",        "name": "당뇨"},
    {"query": "당뇨 병원 후기 혈당 관리 어려움",                 "disease_id": "diabetes",        "name": "당뇨"},
    {"query": "루푸스 스테로이드 부작용 치료 후기",               "disease_id": "lupus",           "name": "루푸스"},
    {"query": "크론병 수술 후기 증상 관리 생활",                  "disease_id": "crohns",          "name": "크론병"},
    {"query": "파킨슨 환자 일상 가족 보호자 후기",                "disease_id": "parkinsons",      "name": "파킨슨"},
    {"query": "류마티스 관절염 치료 부작용 못한말",               "disease_id": "rheumatoid_arthritis", "name": "류마티스"},
    {"query": "갑상선암 수술 후 일상 회복 후기",                  "disease_id": "thyroid_cancer",  "name": "갑상선암"},
    {"query": "고혈압 약 복용 일상 후기 부작용",                  "disease_id": "hypertension",    "name": "고혈압"},
]

MAX_PER_QUERY = 5
DELAY = (3, 6)

PII_PATTERNS = [
    (r"\d{2,3}-\d{3,4}-\d{4}", "[연락처]"),
    (r"[가-힣]{2,4}(병원|의원|클리닉|센터)", "[병원명]"),
    (r"[가-힣]{2,4}\s*(교수님?|원장님?|선생님)", "[의료진명]"),
    (r"\b\d{6}-\d{7}\b", "[주민번호]"),
]

def clean(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    for pat, repl in PII_PATTERNS:
        text = re.sub(pat, repl, text)
    return text[:3000]


async def search_and_collect(page, q_info: dict) -> list:
    posts = []
    query = q_info["query"]
    print(f"\n🔍 검색: {query[:50]}")

    search_url = f"https://search.naver.com/search.naver?where=web&query={query.replace(' ', '+')}"

    try:
        await page.goto(search_url, wait_until="domcontentloaded", timeout=20000)
        await asyncio.sleep(random.uniform(*DELAY))

        # 검색 결과 링크 수집
        results = await page.eval_on_selector_all(
            ".total_tit a, .api_txt_lines a, h3.title a, .news_tit",
            "els => els.map(el => ({href: el.href, title: el.innerText.trim()})).filter(e => e.href && e.title)"
        )

        # 카페/블로그 글만 필터
        results = [r for r in results if any(
            kw in r["href"] for kw in ["cafe.naver.com", "blog.naver.com", "m.cafe.naver.com"]
        )][:MAX_PER_QUERY]

        print(f"  → 카페/블로그 결과: {len(results)}개")

        for i, result in enumerate(results):
            href = result["href"]
            title = clean(result["title"])

            try:
                await page.goto(href, wait_until="domcontentloaded", timeout=15000)
                await asyncio.sleep(random.uniform(*DELAY))

                body = ""

                # 카페 글: iframe 내부 탐색
                for frame in page.frames:
                    for sel in [
                        ".se-main-container",
                        ".article_viewer",
                        "#tbody",
                        ".ArticleContentBox",
                        ".se-component-content",
                    ]:
                        try:
                            el = await frame.query_selector(sel)
                            if el:
                                t = await el.inner_text()
                                if len(t) > 50:
                                    body = t
                                    break
                        except:
                            pass
                    if body:
                        break

                # 블로그 글
                if not body:
                    for sel in [".se-main-container", "#postViewArea", ".post-view", ".se_component_wrap"]:
                        try:
                            el = await page.query_selector(sel)
                            if el:
                                t = await el.inner_text()
                                if len(t) > 50:
                                    body = t
                                    break
                        except:
                            pass

                if len(body) < 50:
                    print(f"  [{i+1}] ⚠️ 본문 없음 (로그인 필요 or 비공개)")
                    continue

                body = clean(body)

                # 환자/환우 관련성 키워드 필터
                keywords = ["병원", "치료", "약", "증상", "의사", "수술", "항암", "부작용", "진료", "검사"]
                if not any(kw in body for kw in keywords):
                    print(f"  [{i+1}] ⚠️ 관련성 낮음 — 스킵")
                    continue

                post = {
                    "id": f"{q_info['disease_id']}_{int(time.time())}_{i}",
                    "disease_id": q_info["disease_id"],
                    "disease_name": q_info["name"],
                    "source": "naver_search",
                    "source_url": href,
                    "title": title,
                    "content": body,
                    "crawled_at": datetime.now().isoformat(),
                }
                posts.append(post)
                print(f"  [{i+1}] ✅ {title[:40]}")

            except Exception as e:
                print(f"  [{i+1}] ❌ {e}")

            await asyncio.sleep(random.uniform(*DELAY))

    except Exception as e:
        print(f"  ❌ 검색 오류: {e}")

    return posts


async def main():
    print("=" * 55)
    print("🏥 병갔왔 — 네이버 검색 기반 수집기")
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

        for q_info in SEARCH_QUERIES:
            posts = await search_and_collect(page, q_info)
            all_posts.extend(posts)
            await asyncio.sleep(random.uniform(5, 10))

        await browser.close()

    # 저장
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out = OUTPUT_DIR / f"search_posts_{ts}.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"total": len(all_posts), "posts": all_posts}, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 완료: {len(all_posts)}개 수집 → {out}")

    from collections import Counter
    dist = Counter(p["disease_name"] for p in all_posts)
    print("\n📊 질환별 수집량:")
    for k, v in sorted(dist.items(), key=lambda x: -x[1]):
        print(f"   {k}: {v}개")

    # 샘플 출력
    if all_posts:
        print(f"\n📝 샘플 (첫 번째 글):")
        s = all_posts[0]
        print(f"   질환: {s['disease_name']}")
        print(f"   제목: {s['title']}")
        print(f"   내용: {s['content'][:200]}...")


if __name__ == "__main__":
    asyncio.run(main())
