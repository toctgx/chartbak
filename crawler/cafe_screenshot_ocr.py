"""
병갔왔 - 네이버 카페 스크린샷 + OCR 수집기
Playwright로 페이지 캡처 → EasyOCR로 한국어 텍스트 추출
⚠️ 내부 개발/테스트 전용 | 런칭 전 운영자 동의 필수
"""

import asyncio
import json
import random
import re
import time
from pathlib import Path
from datetime import datetime
from PIL import Image
import easyocr
from playwright.async_api import async_playwright

OUTPUT_DIR = Path(__file__).parent / "output"
SCREENSHOT_DIR = Path(__file__).parent / "screenshots"
OUTPUT_DIR.mkdir(exist_ok=True)
SCREENSHOT_DIR.mkdir(exist_ok=True)

# OCR 리더 초기화 (한국어 + 영어)
print("🔤 OCR 초기화 중... (첫 실행 시 모델 다운로드됩니다)", flush=True)
reader = easyocr.Reader(['ko', 'en'], gpu=False)
print("✅ OCR 준비 완료", flush=True)

# 수집 대상 - 검색 결과 기반 공개 접근 가능 카페 글 URL
# 네이버 검색에서 카페 글이 미리보기로 보이는 경우 캡처
SEARCH_QUERIES = [
    {"query": "유방암 항암 후기 부작용 site:cafe.naver.com",  "disease_id": "breast_cancer", "name": "유방암"},
    {"query": "당뇨 혈당 관리 일상 cafe.naver.com",           "disease_id": "diabetes",       "name": "당뇨"},
    {"query": "루푸스 스테로이드 치료 cafe.naver.com",        "disease_id": "lupus",          "name": "루푸스"},
    {"query": "크론병 수술 후기 cafe.naver.com",              "disease_id": "crohns",         "name": "크론병"},
    {"query": "파킨슨 보호자 일상 cafe.naver.com",            "disease_id": "parkinsons",     "name": "파킨슨"},
]

# 직접 알려진 공개 카페 글 URL (구글/네이버 검색으로 노출된 것)
KNOWN_PUBLIC_URLS = [
    # 유방암 카페 공개 게시글 (검색에서 발견된 것들)
    ("breast_cancer", "유방암", "https://cafe.naver.com/cancerline"),
    ("diabetes", "당뇨", "https://cafe.naver.com/diabeteskorea"),
    ("lupus", "루푸스", "https://cafe.naver.com/lupuskorea"),
]

DELAY = (3, 6)
MAX_PER_QUERY = 4

PII_PATTERNS = [
    (r"\d{2,3}-\d{3,4}-\d{4}", "[연락처]"),
    (r"[가-힣]{2,5}(병원|의원|클리닉|센터)", "[병원명]"),
    (r"[가-힣]{2,4}\s*(교수님?|원장님?|선생님)", "[의료진명]"),
]

MED_KEYWORDS = ["병원", "치료", "약", "증상", "의사", "수술", "항암", "부작용", "진료", "입원", "처방", "투약"]


def clean_ocr_text(text: str) -> str:
    """OCR 결과 정제"""
    # 줄바꿈 정리
    text = re.sub(r"\n{3,}", "\n\n", text)
    # OCR 노이즈 제거 (특수문자 연속)
    text = re.sub(r"[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ.,!?%·「」『』【】\n\-()]", " ", text)
    text = re.sub(r" {2,}", " ", text)
    # PII 마스킹
    for pat, repl in PII_PATTERNS:
        text = re.sub(pat, repl, text)
    return text.strip()


def extract_text_from_screenshot(image_path: Path) -> str:
    """EasyOCR로 스크린샷에서 텍스트 추출"""
    try:
        results = reader.readtext(str(image_path), detail=0, paragraph=True)
        text = "\n".join(results)
        return clean_ocr_text(text)
    except Exception as e:
        print(f"    OCR 오류: {e}", flush=True)
        return ""


async def screenshot_and_ocr(page, url: str, filename: str) -> str:
    """페이지 스크린샷 → OCR"""
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=20000)
        await asyncio.sleep(random.uniform(2, 4))

        # 전체 페이지 스크린샷
        screenshot_path = SCREENSHOT_DIR / f"{filename}.png"
        await page.screenshot(path=str(screenshot_path), full_page=True)

        # 이미지가 너무 크면 자르기 (OCR 속도 위해)
        img = Image.open(screenshot_path)
        w, h = img.size
        if h > 3000:
            # 상단 3000px만 (메인 본문)
            img = img.crop((0, 0, w, 3000))
            img.save(screenshot_path)

        print(f"    📸 스크린샷: {w}x{h}px", flush=True)

        # OCR
        text = extract_text_from_screenshot(screenshot_path)
        return text

    except Exception as e:
        print(f"    ❌ 오류: {e}", flush=True)
        return ""


async def collect_from_search(page, q_info: dict) -> list:
    """네이버 검색 → 카페 글 URL 발견 → 스크린샷 + OCR"""
    posts = []
    query = q_info["query"]
    print(f"\n🔍 검색: {query}", flush=True)

    # 검색 URL
    enc = query.replace(" ", "+")
    search_url = f"https://search.naver.com/search.naver?where=web&query={enc}"

    await page.goto(search_url, wait_until="domcontentloaded", timeout=20000)
    await asyncio.sleep(random.uniform(*DELAY))

    # 카페 링크 수집
    cafe_links = await page.eval_on_selector_all(
        "a",
        """els => {
            const seen = new Set();
            return els
                .map(a => ({href: a.href || '', text: (a.innerText||'').trim()}))
                .filter(item => {
                    const ok = item.href.match(/cafe\.naver\.com\\/[^/]+\\/\\d+/);
                    if (!ok || seen.has(item.href)) return false;
                    seen.add(item.href);
                    return true;
                })
                .slice(0, 6);
        }"""
    )

    if not cafe_links:
        # 검색어 변형 시도 - cafearticle 탭
        search_url2 = f"https://search.naver.com/search.naver?where=cafearticle&query={enc}"
        await page.goto(search_url2, wait_until="domcontentloaded", timeout=20000)
        await asyncio.sleep(random.uniform(*DELAY))

        cafe_links = await page.eval_on_selector_all(
            "a[href*='cafe.naver.com']",
            """els => {
                const seen = new Set();
                return els
                    .map(a => ({href: a.href || '', text: (a.innerText||'').trim()}))
                    .filter(item => {
                        const ok = item.href.match(/cafe\.naver\.com/);
                        if (!ok || seen.has(item.href)) return false;
                        seen.add(item.href);
                        return true;
                    })
                    .slice(0, 6);
            }"""
        )

    print(f"  발견된 카페 링크: {len(cafe_links)}개", flush=True)

    for i, link in enumerate(cafe_links[:MAX_PER_QUERY]):
        href = link["href"]
        print(f"  [{i+1}] {href[-50:]}", flush=True)

        # 스크린샷 + OCR
        fname = f"{q_info['disease_id']}_{int(time.time())}_{i}"
        text = await screenshot_and_ocr(page, href, fname)

        if len(text) < 50:
            print(f"    ⚠️ 텍스트 부족 (로그인 필요 or 비공개)", flush=True)
            await asyncio.sleep(random.uniform(*DELAY))
            continue

        if not any(kw in text for kw in MED_KEYWORDS):
            print(f"    ⚠️ 의료 관련 낮음", flush=True)
            await asyncio.sleep(random.uniform(*DELAY))
            continue

        posts.append({
            "id": f"{q_info['disease_id']}_{int(time.time())}_{i}",
            "disease_id": q_info["disease_id"],
            "disease_name": q_info["name"],
            "source": "naver_cafe_ocr",
            "source_url": href,
            "screenshot": f"screenshots/{fname}.png",
            "content": text[:3000],
            "crawled_at": datetime.now().isoformat(),
        })
        print(f"    ✅ OCR 완료: {len(text)}자", flush=True)
        await asyncio.sleep(random.uniform(*DELAY))

    return posts


async def main():
    print("=" * 58, flush=True)
    print("🏥 병갔왔 — 카페 스크린샷 + OCR 수집기", flush=True)
    print("   ⚠️  내부 테스트 전용 | 런칭 전 운영자 동의 필수", flush=True)
    print("=" * 58, flush=True)

    all_posts = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        ctx = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 Chrome/124.0 Safari/537.36"
            ),
            locale="ko-KR",
            viewport={"width": 1280, "height": 900},
        )
        page = await ctx.new_page()

        # 카페 메인 페이지도 시도
        print("\n[직접 카페 접근 테스트]", flush=True)
        for disease_id, disease_name, cafe_url in KNOWN_PUBLIC_URLS[:2]:
            print(f"\n  {cafe_url}", flush=True)
            fname = f"cafe_main_{disease_id}"
            text = await screenshot_and_ocr(page, cafe_url, fname)
            if len(text) > 30:
                print(f"  → OCR 결과 미리보기: {text[:200]}", flush=True)
            else:
                print(f"  → 텍스트 없음 (로그인 필요)", flush=True)
            await asyncio.sleep(random.uniform(*DELAY))

        # 검색 기반 수집
        print("\n[검색 기반 수집]", flush=True)
        for q_info in SEARCH_QUERIES:
            posts = await collect_from_search(page, q_info)
            all_posts.extend(posts)
            await asyncio.sleep(random.uniform(4, 8))

        await browser.close()

    # 저장
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out = OUTPUT_DIR / f"cafe_ocr_{ts}.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump({
            "crawled_at": datetime.now().isoformat(),
            "method": "screenshot_ocr",
            "total": len(all_posts),
            "note": "내부 테스트 전용. 런칭 전 운영자 동의 필수.",
            "posts": all_posts,
        }, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 완료: {len(all_posts)}개 → {out}", flush=True)
    print(f"📸 스크린샷: {SCREENSHOT_DIR}", flush=True)

    from collections import Counter
    if all_posts:
        dist = Counter(p["disease_name"] for p in all_posts)
        print("\n📊 질환별:", flush=True)
        for k, v in sorted(dist.items(), key=lambda x: -x[1]):
            print(f"   {k}: {v}개", flush=True)

        print(f"\n📝 OCR 샘플 (1번째):", flush=True)
        s = all_posts[0]
        print(f"   {s['content'][:300]}...", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
