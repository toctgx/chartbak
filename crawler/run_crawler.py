"""
병갔왔 - 네이버 블로그 환자 후기 수집기 v2
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
    {"query": "유방암 진료실 경험 느낌",             "disease_id": "breast_cancer",        "name": "유방암"},
    {"query": "당뇨 혈당 관리 일상 후기",           "disease_id": "diabetes",             "name": "당뇨"},
    {"query": "루푸스 치료 후기 스테로이드",         "disease_id": "lupus",                "name": "루푸스"},
    {"query": "크론병 수술 후기 일상",              "disease_id": "crohns",               "name": "크론병"},
    {"query": "파킨슨 환자 가족 보호자 일상",        "disease_id": "parkinsons",           "name": "파킨슨"},
    {"query": "류마티스 관절염 약 부작용",           "disease_id": "rheumatoid_arthritis", "name": "류마티스"},
    {"query": "갑상선암 수술 회복 경험",            "disease_id": "thyroid_cancer",       "name": "갑상선암"},
    {"query": "고혈압 약 복용 부작용 경험",         "disease_id": "hypertension",         "name": "고혈압"},
    {"query": "폐암 항암 치료 후기",               "disease_id": "lung_cancer",          "name": "폐암"},
    {"query": "우울증 약 치료 경험 솔직",           "disease_id": "depression",           "name": "우울증"},
    {"query": "불임 난임 시험관 후기",             "disease_id": "infertility",          "name": "불임·난임"},
]

MAX_PER_QUERY = 4
DELAY_SHORT = (2, 4)
DELAY_LONG = (4, 7)

PII_PATTERNS = [
    (r"\d{2,3}-\d{3,4}-\d{4}", "[연락처]"),
    (r"[가-힣]{2,5}(병원|의원|클리닉|센터|대학교병원|대학병원)", "[병원명]"),
    (r"[가-힣]{2,4}\s*(교수님?|원장님?|선생님|박사님?)", "[의료진명]"),
]

def clean(text: str) -> str:
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = text.strip()
    for pat, repl in PII_PATTERNS:
        text = re.sub(pat, repl, text)
    return text


def extract_blog_parts(url: str):
    m = re.search(r"blog\.naver\.com/([^/?#]+)/(\d+)", url)
    if m:
        return m.group(1), m.group(2)
    return None, None


async def get_blog_links_from_search(page, query: str) -> list:
    """네이버 블로그 검색 → 글 URL 목록"""
    enc_query = query.replace(" ", "+")
    search_url = f"https://search.naver.com/search.naver?where=blog&query={enc_query}&sm=tab_opt&nso=so:r"

    await page.goto(search_url, wait_until="domcontentloaded", timeout=20000)
    await asyncio.sleep(random.uniform(*DELAY_SHORT))

    # 검색 결과에서 블로그 링크만 추출
    raw_links = await page.eval_on_selector_all(
        "a[href*='blog.naver.com']",
        """els => {
            const seen = new Set();
            return els
                .map(a => ({href: a.href || '', title: (a.innerText || a.textContent || '').trim()}))
                .filter(item => {
                    // 포스트 번호가 있는 URL만
                    const match = item.href.match(/blog\\.naver\\.com\\/[^/]+\\/(\\d+)/);
                    if (!match) return false;
                    if (seen.has(item.href)) return false;
                    seen.add(item.href);
                    return true;
                })
                .slice(0, 8);
        }"""
    )

    # 제목이 있는 것 우선
    links = [l for l in raw_links if l["title"] and len(l["title"]) > 5]
    if not links:
        links = raw_links

    return links[:MAX_PER_QUERY]


async def get_post_body(page, blog_url: str) -> tuple[str, str]:
    """블로그 글 본문 수집 → (title, body)"""
    blog_id, log_no = extract_blog_parts(blog_url)
    if not blog_id or not log_no:
        return "", ""

    post_url = (
        f"https://blog.naver.com/PostView.naver"
        f"?blogId={blog_id}&logNo={log_no}"
        f"&redirect=Dlog&widgetTypeCall=true&directAccess=false"
    )

    await page.goto(post_url, wait_until="domcontentloaded", timeout=15000)
    await asyncio.sleep(random.uniform(*DELAY_SHORT))

    # 제목
    title = await page.title()
    title = re.sub(r"\s*:\s*네이버 블로그$", "", title).strip()

    # 본문
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

    return title, body


async def main():
    print("=" * 58)
    print("🏥 병갔왔 — 네이버 블로그 환자 후기 수집기 v2")
    print("   ⚠️  내부 테스트 전용 | 런칭 전 운영자 동의 필수")
    print("=" * 58)

    all_posts = []
    med_keywords = ["병원", "치료", "약", "증상", "의사", "수술", "항암", "부작용", "진료", "입원", "퇴원", "검사", "투약", "처방"]

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            locale="ko-KR",
            viewport={"width": 1280, "height": 900},
        )
        page = await ctx.new_page()

        for q_info in SEARCH_QUERIES:
            print(f"\n🔍 [{q_info['name']}] {q_info['query']}")
            count = 0

            try:
                links = await get_blog_links_from_search(page, q_info["query"])
                print(f"  → {len(links)}개 링크")

                for i, link in enumerate(links):
                    try:
                        title, body = await get_post_body(page, link["href"])

                        if len(body) < 50:
                            print(f"  [{i+1}] ⚠️ 본문 없음")
                            continue

                        body_clean = clean(body)

                        if not any(kw in body_clean for kw in med_keywords):
                            print(f"  [{i+1}] ⚠️ 의료 관련 낮음 — 스킵")
                            continue

                        title_clean = clean(title or link.get("title", ""))

                        all_posts.append({
                            "id": f"{q_info['disease_id']}_{int(time.time())}_{i}",
                            "disease_id": q_info["disease_id"],
                            "disease_name": q_info["name"],
                            "source": "naver_blog",
                            "source_url": link["href"],
                            "title": title_clean[:100],
                            "content": body_clean[:3000],
                            "crawled_at": datetime.now().isoformat(),
                        })
                        count += 1
                        print(f"  [{i+1}] ✅ {title_clean[:45]}")

                    except Exception as e:
                        print(f"  [{i+1}] ❌ {e}")

                    await asyncio.sleep(random.uniform(*DELAY_LONG))

            except Exception as e:
                print(f"  ❌ 검색 실패: {e}")

            print(f"  → 수집: {count}개")
            await asyncio.sleep(random.uniform(*DELAY_LONG))

        await browser.close()

    # 저장
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out = OUTPUT_DIR / f"blog_posts_{ts}.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump({
            "crawled_at": datetime.now().isoformat(),
            "total": len(all_posts),
            "source": "naver_blog",
            "note": "내부 테스트 전용. 런칭 전 운영자 동의 필수.",
            "posts": all_posts,
        }, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 완료: 총 {len(all_posts)}개 → {out}")

    from collections import Counter
    dist = Counter(p["disease_name"] for p in all_posts)
    print("\n📊 질환별 수집량:")
    for k, v in sorted(dist.items(), key=lambda x: -x[1]):
        print(f"   {k}: {v}개")

    if all_posts:
        s = all_posts[0]
        print(f"\n📝 샘플 (1번째):")
        print(f"   [{s['disease_name']}] {s['title']}")
        print(f"   {s['content'][:300]}...")


if __name__ == "__main__":
    asyncio.run(main())
