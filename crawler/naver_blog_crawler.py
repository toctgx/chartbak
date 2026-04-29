"""
병갔왔 - 네이버 블로그 환자 후기 수집기
네이버 블로그 검색 → 공개 글 본문 수집
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

# 질환별 검색 쿼리
SEARCH_QUERIES = [
    {"query": "유방암 항암 치료 후기 부작용",        "disease_id": "breast_cancer",         "name": "유방암"},
    {"query": "유방암 진료 경험 의사 이야기",         "disease_id": "breast_cancer",         "name": "유방암"},
    {"query": "당뇨 혈당 관리 일상 후기",            "disease_id": "diabetes",              "name": "당뇨"},
    {"query": "당뇨 인슐린 복용 경험 어려움",         "disease_id": "diabetes",              "name": "당뇨"},
    {"query": "루푸스 치료 후기 스테로이드 부작용",   "disease_id": "lupus",                 "name": "루푸스"},
    {"query": "크론병 수술 후기 일상 관리",           "disease_id": "crohns",                "name": "크론병"},
    {"query": "파킨슨 환자 가족 보호자 후기",         "disease_id": "parkinsons",            "name": "파킨슨"},
    {"query": "류마티스 관절염 약 부작용 치료",        "disease_id": "rheumatoid_arthritis",  "name": "류마티스"},
    {"query": "갑상선암 수술 후 회복 경험",           "disease_id": "thyroid_cancer",        "name": "갑상선암"},
    {"query": "고혈압 약 복용 일상 후기",             "disease_id": "hypertension",          "name": "고혈압"},
    {"query": "폐암 항암 치료 경험 솔직",             "disease_id": "lung_cancer",           "name": "폐암"},
    {"query": "우울증 치료 경험 약 복용 후기",        "disease_id": "depression",            "name": "우울증"},
]

MAX_PER_QUERY = 5
DELAY = (3, 6)

PII_PATTERNS = [
    (r"\d{2,3}-\d{3,4}-\d{4}", "[연락처]"),
    (r"[가-힣]{2,4}(병원|의원|클리닉|센터|대학교병원)", "[병원명]"),
    (r"[가-힣]{2,4}\s*(교수님?|원장님?|선생님|박사님?)", "[의료진명]"),
]

def clean(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    for pat, repl in PII_PATTERNS:
        text = re.sub(pat, repl, text)
    return text


def extract_blog_id_logno(url: str):
    """blog.naver.com URL에서 blogId, logNo 추출"""
    m = re.search(r"blog\.naver\.com/([^/?#]+)/(\d+)", url)
    if m:
        return m.group(1), m.group(2)
    return None, None


async def get_blog_links(page, query: str) -> list:
    """네이버 블로그 검색 결과에서 링크 수집"""
    url = f"https://search.naver.com/search.naver?where=blog&query={query.replace(' ', '+')}"
    await page.goto(url, wait_until="domcontentloaded", timeout=20000)
    await asyncio.sleep(random.uniform(*DELAY))

    # 블로그 링크 수집 (중복 제거)
    links = await page.eval_on_selector_all(
        "a",
        """els => {
            const seen = new Set();
            return els
                .filter(a => {
                    const href = a.href || '';
                    const text = a.innerText.trim();
                    return href.includes('blog.naver.com') &&
                           /\\d{5,}/.test(href) &&
                           text.length > 5 &&
                           !seen.has(href) &&
                           seen.add(href);
                })
                .map(a => ({href: a.href, title: a.innerText.trim()}))
                .slice(0, 10);
        }"""
    )
    return links


async def get_blog_content(page, blog_url: str) -> str:
    """블로그 글 본문 수집 (iframe PostView 방식)"""
    blog_id, log_no = extract_blog_id_logno(blog_url)
    if not blog_id or not log_no:
        return ""

    post_url = (
        f"https://blog.naver.com/PostView.naver"
        f"?blogId={blog_id}&logNo={log_no}"
        f"&redirect=Dlog&widgetTypeCall=true&directAccess=false"
    )

    await page.goto(post_url, wait_until="domcontentloaded", timeout=15000)
    await asyncio.sleep(random.uniform(2, 4))

    # 본문 셀렉터 (우선순위 순)
    for sel in [".se-main-container", "#postViewArea", ".post-view", ".se_component_wrap"]:
        try:
            el = await page.query_selector(sel)
            if el:
                text = await el.inner_text()
                if len(text) > 50:
                    return text
        except:
            pass

    return ""


async def collect_query(page, q_info: dict) -> list:
    posts = []
    print(f"\n🔍 [{q_info['name']}] {q_info['query']}")

    try:
        links = await get_blog_links(page, q_info["query"])
        print(f"  → 링크 {len(links)}개 발견")

        for i, link in enumerate(links[:MAX_PER_QUERY]):
            href = link["href"]
            title = clean(link["title"])

            try:
                body = await get_blog_content(page, href)
                if len(body) < 50:
                    print(f"  [{i+1}] ⚠️ 본문 없음")
                    continue

                body = clean(body)

                # 의료 관련성 확인
                med_keywords = ["병원", "치료", "약", "증상", "의사", "수술", "항암", "부작용", "진료", "검사", "투약", "입원", "퇴원"]
                if not any(kw in body for kw in med_keywords):
                    print(f"  [{i+1}] ⚠️ 의료 관련 없음 — 스킵")
                    continue

                posts.append({
                    "id": f"{q_info['disease_id']}_{int(time.time())}_{i}",
                    "disease_id": q_info["disease_id"],
                    "disease_name": q_info["name"],
                    "source": "naver_blog",
                    "source_url": href,
                    "title": title[:100],
                    "content": body[:3000],
                    "crawled_at": datetime.now().isoformat(),
                })
                print(f"  [{i+1}] ✅ {title[:45]}")

            except Exception as e:
                print(f"  [{i+1}] ❌ {e}")

            await asyncio.sleep(random.uniform(*DELAY))

    except Exception as e:
        print(f"  ❌ 오류: {e}")

    return posts


async def main():
    print("=" * 57)
    print("🏥 병갔왔 — 네이버 블로그 환자 후기 수집기")
    print("   ⚠️  내부 테스트 전용 | 런칭 전 운영자 동의 필수")
    print("=" * 57)

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
            posts = await collect_query(page, q_info)
            all_posts.extend(posts)
            await asyncio.sleep(random.uniform(4, 8))

        await browser.close()

    # 저장
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out = OUTPUT_DIR / f"blog_posts_{ts}.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"total": len(all_posts), "posts": all_posts}, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 완료: {len(all_posts)}개 → {out}")

    from collections import Counter
    dist = Counter(p["disease_name"] for p in all_posts)
    print("\n📊 질환별:")
    for k, v in sorted(dist.items(), key=lambda x: -x[1]):
        print(f"   {k}: {v}개")

    if all_posts:
        s = all_posts[0]
        print(f"\n📝 샘플:")
        print(f"   [{s['disease_name']}] {s['title']}")
        print(f"   {s['content'][:250]}...")


if __name__ == "__main__":
    asyncio.run(main())
