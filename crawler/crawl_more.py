"""
병갔왔 - 추가 블로그 수집
일반 100개 + 난임/불임 50개
"""
import asyncio, json, random, re, time
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright

OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

# ── 일반 질환 (100개 목표) ────────────────────────────────
GENERAL_QUERIES = [
    # 유방암
    {"query": "유방암 항암 2차 3차 후기",           "disease_id": "breast_cancer",          "name": "유방암"},
    {"query": "유방암 재건수술 후기 경험",           "disease_id": "breast_cancer",          "name": "유방암"},
    {"query": "유방암 호르몬치료 부작용",            "disease_id": "breast_cancer",          "name": "유방암"},
    {"query": "유방암 보호자 남편 와이프 간병",      "disease_id": "breast_cancer",          "name": "유방암"},
    # 당뇨
    {"query": "당뇨 1형 2형 치료 일상 후기",        "disease_id": "diabetes",               "name": "당뇨"},
    {"query": "당뇨 합병증 경험 예방",              "disease_id": "diabetes",               "name": "당뇨"},
    {"query": "당뇨 식단 관리 어려움 솔직",         "disease_id": "diabetes",               "name": "당뇨"},
    {"query": "당뇨 환우 보호자 부모님",            "disease_id": "diabetes",               "name": "당뇨"},
    # 루푸스
    {"query": "루푸스 임신 출산 경험",              "disease_id": "lupus",                  "name": "루푸스"},
    {"query": "루푸스 관해 재발 경험",              "disease_id": "lupus",                  "name": "루푸스"},
    {"query": "루푸스 신염 치료 후기",              "disease_id": "lupus",                  "name": "루푸스"},
    # 크론병
    {"query": "크론병 장루 생활 경험",              "disease_id": "crohns",                 "name": "크론병"},
    {"query": "크론병 식이요법 음식 조절",          "disease_id": "crohns",                 "name": "크론병"},
    {"query": "크론병 생물학적 제제 휴미라 후기",   "disease_id": "crohns",                 "name": "크론병"},
    # 파킨슨
    {"query": "파킨슨병 약 레보도파 복용 후기",     "disease_id": "parkinsons",             "name": "파킨슨"},
    {"query": "파킨슨병 초기 증상 진단 받은 후",    "disease_id": "parkinsons",             "name": "파킨슨"},
    {"query": "파킨슨 가족 보호자 돌봄 일상",       "disease_id": "parkinsons",             "name": "파킨슨"},
    # 류마티스
    {"query": "류마티스관절염 메토트렉세이트 후기", "disease_id": "rheumatoid_arthritis",   "name": "류마티스"},
    {"query": "류마티스 생물학적 치료 후기",        "disease_id": "rheumatoid_arthritis",   "name": "류마티스"},
    {"query": "류마티스관절염 초기 증상 진단",      "disease_id": "rheumatoid_arthritis",   "name": "류마티스"},
    # 갑상선암
    {"query": "갑상선암 방사성요오드 치료 후기",    "disease_id": "thyroid_cancer",         "name": "갑상선암"},
    {"query": "갑상선암 재발 추적관찰 후기",        "disease_id": "thyroid_cancer",         "name": "갑상선암"},
    {"query": "갑상선암 수술 후 칼슘 목소리",       "disease_id": "thyroid_cancer",         "name": "갑상선암"},
    # 고혈압
    {"query": "고혈압 40대 50대 진단 후기",         "disease_id": "hypertension",           "name": "고혈압"},
    {"query": "고혈압 약 평생 복용 걱정 경험",      "disease_id": "hypertension",           "name": "고혈압"},
    # 폐암
    {"query": "폐암 표적치료제 타그리소 후기",      "disease_id": "lung_cancer",            "name": "폐암"},
    {"query": "폐암 면역항암제 후기 경험",          "disease_id": "lung_cancer",            "name": "폐암"},
    {"query": "폐암 가족 부모님 간병 보호자",       "disease_id": "lung_cancer",            "name": "폐암"},
    # 우울증
    {"query": "우울증 항우울제 처음 먹어본 후기",   "disease_id": "depression",             "name": "우울증"},
    {"query": "우울증 회복 과정 솔직 후기",         "disease_id": "depression",             "name": "우울증"},
    {"query": "우울증 정신과 상담 치료 경험",       "disease_id": "depression",             "name": "우울증"},
    # 갑상선질환
    {"query": "갑상선기능저하증 신티론 씬지로이드", "disease_id": "thyroid",                "name": "갑상선질환"},
    {"query": "갑상선기능항진증 메르카졸 치료",     "disease_id": "thyroid",                "name": "갑상선질환"},
    # 신장
    {"query": "만성신부전 투석 경험 후기",          "disease_id": "kidney",                 "name": "신장질환"},
    {"query": "신장이식 후기 경험 일상",            "disease_id": "kidney",                 "name": "신장질환"},
    # 만성통증
    {"query": "만성통증 섬유근육통 일상 후기",      "disease_id": "chronic_pain",           "name": "만성통증"},
    {"query": "디스크 만성요통 치료 경험",          "disease_id": "chronic_pain",           "name": "만성통증"},
    # 위암
    {"query": "위암 수술 후 일상 후기",             "disease_id": "stomach_cancer",         "name": "위암"},
    {"query": "위암 항암치료 후기 경험",            "disease_id": "stomach_cancer",         "name": "위암"},
    # 대장암
    {"query": "대장암 수술 후 일상 식단",           "disease_id": "colorectal_cancer",      "name": "대장암"},
    {"query": "대장암 항암 후기 부작용",            "disease_id": "colorectal_cancer",      "name": "대장암"},
]

# ── 난임/불임 (50개 목표) ─────────────────────────────────
INFERTILITY_QUERIES = [
    {"query": "시험관 1차 실패 후기",                       "disease_id": "infertility", "name": "난임·불임"},
    {"query": "시험관 2차 3차 후기 성공",                   "disease_id": "infertility", "name": "난임·불임"},
    {"query": "시험관 신선배아 동결배아 후기",              "disease_id": "infertility", "name": "난임·불임"},
    {"query": "시험관 이식 착상 실패 경험",                 "disease_id": "infertility", "name": "난임·불임"},
    {"query": "시험관 과배란 채취 후기",                    "disease_id": "infertility", "name": "난임·불임"},
    {"query": "인공수정 후기 성공 실패",                    "disease_id": "infertility", "name": "난임·불임"},
    {"query": "난임 원인 검사 후기 경험",                   "disease_id": "infertility", "name": "난임·불임"},
    {"query": "난임 스트레스 심리 감정 솔직",               "disease_id": "infertility", "name": "난임·불임"},
    {"query": "난임 치료 포기 결심 후기",                   "disease_id": "infertility", "name": "난임·불임"},
    {"query": "난임 남편 남성불임 정자 후기",               "disease_id": "infertility", "name": "난임·불임"},
    {"query": "불임 검사 자궁 나팔관 후기",                 "disease_id": "infertility", "name": "난임·불임"},
    {"query": "불임 치료 난소기능저하 후기",                "disease_id": "infertility", "name": "난임·불임"},
    {"query": "난임 시험관 비용 지원금 경험",               "disease_id": "infertility", "name": "난임·불임"},
    {"query": "착상 전 유전자 검사 PGT 후기",               "disease_id": "infertility", "name": "난임·불임"},
    {"query": "반복착상실패 원인 치료 경험",                "disease_id": "infertility", "name": "난임·불임"},
    {"query": "습관성 유산 반복유산 치료 후기",             "disease_id": "infertility", "name": "난임·불임"},
    {"query": "다낭성난소증후군 PCOS 임신 후기",            "disease_id": "infertility", "name": "난임·불임"},
    {"query": "자궁내막증 임신 시험관 후기",                "disease_id": "infertility", "name": "난임·불임"},
    {"query": "희발월경 무월경 배란유도 후기",              "disease_id": "infertility", "name": "난임·불임"},
    {"query": "조기난소부전 난임 치료 경험",                "disease_id": "infertility", "name": "난임·불임"},
]

MAX_PER_QUERY = 5  # 일반: 40개 쿼리 × 5 = 200 → 중복 제거 후 약 100개
MAX_INF_PER_QUERY = 4  # 난임: 20개 쿼리 × 4 = 80 → 중복 제거 후 약 50개
DELAY = (3, 6)

PII_PATTERNS = [
    (r"\d{2,3}-\d{3,4}-\d{4}", "[연락처]"),
    (r"[가-힣]{2,5}(병원|의원|클리닉|센터|대학교병원|대학병원)", "[병원명]"),
    (r"[가-힣]{2,4}\s*(교수님?|원장님?|선생님|박사님?)", "[의료진명]"),
]
MED_KEYWORDS = ["병원", "치료", "약", "증상", "의사", "수술", "항암", "부작용", "진료", "처방", "임신", "배아", "이식", "채취", "난소", "자궁", "착상", "유산"]

def clean(text):
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    for pat, repl in PII_PATTERNS:
        text = re.sub(pat, repl, text)
    return text[:3000]

def extract_parts(url):
    m = re.search(r"blog\.naver\.com/([^/?#]+)/(\d+)", url)
    return (m.group(1), m.group(2)) if m else (None, None)

async def get_links(page, query, max_n):
    enc = query.replace(" ", "+")
    url = f"https://search.naver.com/search.naver?where=blog&query={enc}&sm=tab_opt&nso=so:r,p:all"
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=25000)
        await asyncio.sleep(random.uniform(2, 4))
    except:
        return []
    raw = await page.eval_on_selector_all(
        "a",
        """els => {
            const seen = new Set();
            return els.map(a => a.href||'')
                .filter(h => { if (!h.match(/blog\\.naver\\.com\\/[^/]+\\/\\d+/)||seen.has(h)) return false; seen.add(h); return true; });
        }"""
    )
    return raw[:max_n]

async def get_body(page, url):
    blog_id, log_no = extract_parts(url)
    if not blog_id: return "", ""
    post_url = f"https://blog.naver.com/PostView.naver?blogId={blog_id}&logNo={log_no}&redirect=Dlog&widgetTypeCall=true&directAccess=false"
    try:
        await page.goto(post_url, wait_until="domcontentloaded", timeout=15000)
        await asyncio.sleep(random.uniform(2, 4))
        title = re.sub(r"\s*:\s*네이버 블로그$", "", await page.title()).strip()
        body = ""
        for sel in [".se-main-container", "#postViewArea", ".post-view"]:
            el = await page.query_selector(sel)
            if el:
                t = await el.inner_text()
                if len(t) > 50:
                    body = t; break
        return title, body
    except:
        return "", ""

async def collect(page, queries, max_per_q, label):
    posts = []
    seen_urls = set()
    for q in queries:
        print(f"\n🔍 [{label}] {q['query']}", flush=True)
        links = await get_links(page, q["query"], max_per_q)
        print(f"  → {len(links)}개 링크", flush=True)
        count = 0
        for i, url in enumerate(links):
            if url in seen_urls: continue
            seen_urls.add(url)
            title, body = await get_body(page, url)
            if len(body) < 50: continue
            body_c = clean(body)
            if not any(kw in body_c for kw in MED_KEYWORDS): continue
            posts.append({
                "id": f"{q['disease_id']}_{int(time.time())}_{i}",
                "disease_id": q["disease_id"],
                "disease_name": q["name"],
                "source": "naver_blog",
                "source_url": url,
                "title": clean(title)[:100],
                "content": body_c,
                "crawled_at": datetime.now().isoformat(),
            })
            count += 1
            print(f"  ✅ [{count}] {title[:45]}", flush=True)
            await asyncio.sleep(random.uniform(*DELAY))
        await asyncio.sleep(random.uniform(3, 6))
    return posts

async def main():
    print("=" * 58, flush=True)
    print("🏥 병갔왔 — 추가 블로그 수집 (일반 100 + 난임 50)", flush=True)
    print("=" * 58, flush=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
            locale="ko-KR", viewport={"width": 1280, "height": 900},
        )
        page = await ctx.new_page()
        page.set_default_timeout(20000)

        # 일반 수집
        print("\n\n📋 [1단계] 일반 질환 블로그 수집", flush=True)
        general_posts = await collect(page, GENERAL_QUERIES, MAX_PER_QUERY, "일반")

        # 난임 수집
        print("\n\n👶 [2단계] 난임·불임 블로그 수집", flush=True)
        infertility_posts = await collect(page, INFERTILITY_QUERIES, MAX_INF_PER_QUERY, "난임")

        await browser.close()

    all_posts = general_posts + infertility_posts

    # 저장
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out = OUTPUT_DIR / f"more_posts_{ts}.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"total": len(all_posts), "general": len(general_posts), "infertility": len(infertility_posts), "posts": all_posts}, f, ensure_ascii=False, indent=2)

    print(f"\n\n✅ 완료!", flush=True)
    print(f"   일반: {len(general_posts)}개", flush=True)
    print(f"   난임: {len(infertility_posts)}개", flush=True)
    print(f"   합계: {len(all_posts)}개 → {out}", flush=True)

    from collections import Counter
    dist = Counter(p["disease_name"] for p in all_posts)
    print("\n📊 질환별:", flush=True)
    for k, v in sorted(dist.items(), key=lambda x: -x[1]):
        print(f"   {k}: {v}개", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
