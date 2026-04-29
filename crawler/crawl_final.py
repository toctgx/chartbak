"""
병갔왔 - 네이버 블로그 환자 후기 수집기 (최종)
1단계: 네이버 블로그 검색으로 URL 수집
2단계: 각 블로그 글 본문 수집
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

SEARCH_QUERIES = [
    {"query": "유방암 항암 치료 후기 부작용",       "disease_id": "breast_cancer",        "name": "유방암"},
    {"query": "유방암 진료 경험 못한말 솔직",        "disease_id": "breast_cancer",        "name": "유방암"},
    {"query": "당뇨 혈당 관리 일상 후기",           "disease_id": "diabetes",             "name": "당뇨"},
    {"query": "당뇨 인슐린 복용 어려움 경험",        "disease_id": "diabetes",             "name": "당뇨"},
    {"query": "루푸스 스테로이드 치료 후기",         "disease_id": "lupus",                "name": "루푸스"},
    {"query": "크론병 수술 후기 일상",              "disease_id": "crohns",               "name": "크론병"},
    {"query": "파킨슨 환자 가족 보호자 후기",        "disease_id": "parkinsons",           "name": "파킨슨"},
    {"query": "류마티스관절염 약 부작용 치료",        "disease_id": "rheumatoid_arthritis", "name": "류마티스"},
    {"query": "갑상선암 수술 회복 후기",            "disease_id": "thyroid_cancer",       "name": "갑상선암"},
    {"query": "고혈압 약 부작용 복용 경험",         "disease_id": "hypertension",         "name": "고혈압"},
    {"query": "폐암 항암 치료 후기 솔직",           "disease_id": "lung_cancer",          "name": "폐암"},
    {"query": "우울증 약 치료 경험",               "disease_id": "depression",           "name": "우울증"},
    {"query": "불임 난임 시험관 후기",             "disease_id": "infertility",          "name": "불임·난임"},
    {"query": "갑상선 기능 저하증 약 일상",         "disease_id": "thyroid",              "name": "갑상선질환"},
]

MAX_URLS_PER_QUERY = 5
DELAY = (3, 6)

PII_PATTERNS = [
    (r"\d{2,3}-\d{3,4}-\d{4}", "[연락처]"),
    (r"[가-힣]{2,5}(병원|의원|클리닉|센터|대학교병원|대학병원)", "[병원명]"),
    (r"[가-힣]{2,4}\s*(교수님?|원장님?|선생님|박사님?)", "[의료진명]"),
]

MED_KEYWORDS = ["병원", "치료", "약", "증상", "의사", "수술", "항암", "부작용", "진료", "입원", "처방", "투약", "회복"]


def clean(text: str) -> str:
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    for pat, repl in PII_PATTERNS:
        text = re.sub(pat, repl, text)
    return text[:3000]


def extract_parts(url: str):
    m = re.search(r"blog\.naver\.com/([^/?#]+)/(\d+)", url)
    return (m.group(1), m.group(2)) if m else (None, None)


async def collect_urls_from_search(page, query: str) -> list:
    """블로그 검색 결과에서 URL 목록 수집"""
    enc = query.replace(" ", "+")
    url = f"https://search.naver.com/search.naver?where=blog&query={enc}&sm=tab_opt&nso=so:r,p:all"

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=25000)
        await asyncio.sleep(random.uniform(3, 5))
    except Exception as e:
        print(f"  ⚠️ 검색 로드 실패: {e}", flush=True)
        return []

    # 모든 a 태그에서 블로그 글 URL 추출
    raw = await page.eval_on_selector_all(
        "a",
        """els => {
            const seen = new Set();
            return els
                .map(a => a.href || '')
                .filter(href => {
                    if (!href.match(/blog\\.naver\\.com\\/[^/]+\\/\\d+/)) return false;
                    if (seen.has(href)) return false;
                    seen.add(href);
                    return true;
                });
        }"""
    )
    return raw[:MAX_URLS_PER_QUERY]


async def collect_post(page, url: str, disease_id: str, disease_name: str, idx: int) -> dict:
    """블로그 글 본문 수집"""
    blog_id, log_no = extract_parts(url)
    if not blog_id:
        return None

    post_url = (
        f"https://blog.naver.com/PostView.naver"
        f"?blogId={blog_id}&logNo={log_no}"
        f"&redirect=Dlog&widgetTypeCall=true&directAccess=false"
    )

    try:
        await page.goto(post_url, wait_until="domcontentloaded", timeout=15000)
        await asyncio.sleep(random.uniform(2, 4))

        title = await page.title()
        title = re.sub(r"\s*:\s*네이버 블로그$", "", title).strip()

        body = ""
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
            return None

        body_clean = clean(body)

        if not any(kw in body_clean for kw in MED_KEYWORDS):
            return None

        return {
            "id": f"{disease_id}_{int(time.time())}_{idx}",
            "disease_id": disease_id,
            "disease_name": disease_name,
            "source": "naver_blog",
            "source_url": url,
            "title": clean(title)[:100],
            "content": body_clean,
            "crawled_at": datetime.now().isoformat(),
        }

    except Exception as e:
        print(f"    ❌ {e}", flush=True)
        return None


async def main():
    print("=" * 58, flush=True)
    print("🏥 병갔왔 — 네이버 블로그 환자 후기 수집기", flush=True)
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
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
            locale="ko-KR",
            viewport={"width": 1280, "height": 900},
        )
        page = await ctx.new_page()
        page.set_default_timeout(20000)

        # 1단계: URL 수집
        print("\n[1단계] 블로그 URL 수집 중...", flush=True)
        url_pool = []  # [(disease_id, disease_name, url), ...]

        for q in SEARCH_QUERIES:
            print(f"  🔍 {q['name']}: {q['query']}", flush=True)
            urls = await collect_urls_from_search(page, q["query"])
            for u in urls:
                url_pool.append((q["disease_id"], q["name"], u))
            print(f"     → {len(urls)}개", flush=True)
            await asyncio.sleep(random.uniform(*DELAY))

        print(f"\n[2단계] 본문 수집 (총 {len(url_pool)}개 URL)", flush=True)

        # 2단계: 본문 수집
        seen_urls = set()
        for i, (disease_id, disease_name, url) in enumerate(url_pool):
            if url in seen_urls:
                continue
            seen_urls.add(url)

            print(f"  [{i+1}/{len(url_pool)}] {disease_name} - {url[-40:]}", flush=True)
            post = await collect_post(page, url, disease_id, disease_name, i)

            if post:
                all_posts.append(post)
                print(f"    ✅ {post['title'][:50]}", flush=True)
            else:
                print(f"    ⚠️ 스킵", flush=True)

            await asyncio.sleep(random.uniform(*DELAY))

        await browser.close()

    # 저장
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out = OUTPUT_DIR / f"final_posts_{ts}.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump({
            "crawled_at": datetime.now().isoformat(),
            "total": len(all_posts),
            "source": "naver_blog",
            "note": "내부 테스트 전용. 런칭 전 운영자 동의 필수.",
            "posts": all_posts,
        }, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 완료: 총 {len(all_posts)}개 → {out}", flush=True)

    from collections import Counter
    dist = Counter(p["disease_name"] for p in all_posts)
    print("\n📊 질환별:", flush=True)
    for k, v in sorted(dist.items(), key=lambda x: -x[1]):
        print(f"   {k}: {v}개", flush=True)

    if all_posts:
        s = all_posts[0]
        print(f"\n📝 샘플:", flush=True)
        print(f"   [{s['disease_name']}] {s['title']}", flush=True)
        print(f"   {s['content'][:250]}...", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
