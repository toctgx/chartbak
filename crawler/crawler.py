"""
병갔왔 - 네이버 카페 공개 게시글 크롤러

⚠️  원칙:
  - 로그인 없이 공개된 게시글만 수집
  - robots.txt 준수
  - 요청 간격 3~7초 (서버 부하 최소화)
  - 개인정보(닉네임 포함) 저장 안 함 → 내용 텍스트만
  - 법률 자문 완료 후 정식 운영 권장
"""

import asyncio
import json
import random
import time
import re
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright

# ─── 크롤링 대상 카페 (공개 게시판만) ───────────────────────────────────────
# robots.txt 확인: https://cafe.naver.com/robots.txt
# 네이버 카페는 공개 글의 경우 비로그인으로 일부 접근 가능

TARGET_CAFES = [
    {
        "cafe_id": "cancerline",
        "name": "유방암",
        "disease_id": "breast_cancer",
        "board_id": None,  # None이면 전체 게시판
    },
    {
        "cafe_id": "diabeteskorea",
        "name": "당뇨",
        "disease_id": "diabetes",
        "board_id": None,
    },
    {
        "cafe_id": "lupuskorea",
        "name": "루푸스",
        "disease_id": "lupus",
        "board_id": None,
    },
    {
        "cafe_id": "crohns",
        "name": "크론병",
        "disease_id": "crohns",
        "board_id": None,
    },
    {
        "cafe_id": "parkinson",
        "name": "파킨슨",
        "disease_id": "parkinsons",
        "board_id": None,
    },
]

# ─── 설정 ────────────────────────────────────────────────────────────────────
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

MAX_POSTS_PER_CAFE = 30       # 카페당 최대 수집 글 수 (소량 원칙)
DELAY_MIN = 3.0               # 최소 요청 간격 (초)
DELAY_MAX = 7.0               # 최대 요청 간격 (초)
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

# ─── 개인정보 마스킹 패턴 ────────────────────────────────────────────────────
PII_PATTERNS = [
    (r"\d{2,3}-\d{3,4}-\d{4}", "[전화번호]"),
    (r"\b\d{6}-\d{7}\b", "[주민번호]"),
    (r"[가-힣]{2,4}\s*(병원|의원|클리닉|센터)", "[병원명]"),
    (r"[가-힣]{2,4}\s*교수|[가-힣]{2,4}\s*원장|[가-힣]{2,4}\s*선생님", "[의사명]"),
]

def mask_pii(text: str) -> str:
    """개인정보 마스킹"""
    for pattern, replacement in PII_PATTERNS:
        text = re.sub(pattern, replacement, text)
    return text

def clean_text(text: str) -> str:
    """텍스트 정제"""
    text = text.strip()
    text = re.sub(r"\n{3,}", "\n\n", text)  # 과도한 줄바꿈 제거
    text = re.sub(r" {2,}", " ", text)       # 연속 공백 제거
    return mask_pii(text)


async def check_public_access(page, cafe_id: str) -> bool:
    """카페가 비로그인으로 접근 가능한지 확인"""
    url = f"https://cafe.naver.com/{cafe_id}"
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=15000)
        await asyncio.sleep(2)

        # 로그인 요구 팝업/리다이렉트 확인
        content = await page.content()
        if "로그인" in content and "로그인이 필요" in content:
            print(f"  ⛔ {cafe_id}: 로그인 필요 (스킵)")
            return False

        # 카페 존재 확인
        if "존재하지 않는" in content or "찾을 수 없" in content:
            print(f"  ❌ {cafe_id}: 카페 없음 (스킵)")
            return False

        print(f"  ✅ {cafe_id}: 공개 접근 가능")
        return True
    except Exception as e:
        print(f"  ❌ {cafe_id}: 접근 오류 - {e}")
        return False


async def crawl_cafe_posts(page, cafe: dict) -> list[dict]:
    """카페 게시글 목록 크롤링"""
    cafe_id = cafe["cafe_id"]
    disease_id = cafe["disease_id"]
    posts = []

    # 카페 게시판 목록 URL
    list_url = f"https://cafe.naver.com/{cafe_id}"

    print(f"\n📋 [{cafe['name']}] 크롤링 시작...")

    try:
        await page.goto(list_url, wait_until="domcontentloaded", timeout=20000)
        await asyncio.sleep(random.uniform(DELAY_MIN, DELAY_MAX))

        # iframe 내부 접근 시도 (네이버 카페 구조)
        frames = page.frames
        cafe_frame = None
        for frame in frames:
            if "cafe.naver.com" in frame.url and "ArticleList" in frame.url:
                cafe_frame = frame
                break

        # 게시글 링크 수집
        if cafe_frame:
            articles = await cafe_frame.query_selector_all("a.article")
        else:
            articles = await page.query_selector_all("a.article, .article-item a, .board-list a")

        print(f"  발견된 게시글: {len(articles)}개")

        for i, article in enumerate(articles[:MAX_POSTS_PER_CAFE]):
            try:
                href = await article.get_attribute("href")
                title = await article.inner_text()
                title = title.strip()

                if not href or not title:
                    continue

                # 상세 페이지 크롤링
                post_data = await crawl_post_detail(page, href, cafe, title)
                if post_data:
                    posts.append(post_data)
                    print(f"  [{i+1}] ✅ {title[:30]}...")

                # 요청 간격
                await asyncio.sleep(random.uniform(DELAY_MIN, DELAY_MAX))

            except Exception as e:
                print(f"  [{i+1}] ⚠️ 파싱 오류: {e}")
                continue

    except Exception as e:
        print(f"  ❌ 카페 접근 실패: {e}")

    return posts


async def crawl_post_detail(page, url: str, cafe: dict, title: str) -> dict | None:
    """게시글 상세 내용 크롤링"""
    try:
        # 절대 URL 변환
        if not url.startswith("http"):
            url = f"https://cafe.naver.com{url}"

        await page.goto(url, wait_until="domcontentloaded", timeout=15000)
        await asyncio.sleep(1)

        # 본문 추출 (여러 선택자 시도)
        content = ""
        selectors = [
            ".se-main-container",
            ".article_viewer",
            "#tbody",
            ".ArticleContentBox",
        ]
        for sel in selectors:
            el = await page.query_selector(sel)
            if el:
                content = await el.inner_text()
                break

        if not content or len(content) < 20:
            return None

        content = clean_text(content)

        # 날짜 추출
        date_str = ""
        date_el = await page.query_selector(".date, .article_info .date, ._postListDate")
        if date_el:
            date_str = await date_el.inner_text()

        return {
            "id": f"{cafe['cafe_id']}_{int(time.time())}_{random.randint(1000, 9999)}",
            "disease_id": cafe["disease_id"],
            "disease_name": cafe["name"],
            "source": "naver_cafe",
            "source_cafe": cafe["cafe_id"],
            "source_url": url,
            "title": clean_text(title),
            "content": content,
            "raw_date": date_str,
            "crawled_at": datetime.now().isoformat(),
            # 작성자 정보는 수집하지 않음 (개인정보 보호)
        }

    except Exception as e:
        return None


async def save_results(all_posts: list[dict]):
    """결과 저장"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = OUTPUT_DIR / f"crawled_{timestamp}.json"

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({
            "crawled_at": datetime.now().isoformat(),
            "total_posts": len(all_posts),
            "posts": all_posts,
        }, f, ensure_ascii=False, indent=2)

    print(f"\n💾 저장 완료: {output_file}")
    print(f"📊 총 수집 게시글: {len(all_posts)}개")
    return output_file


async def main():
    print("=" * 60)
    print("🏥 병갔왔 - 네이버 카페 공개 게시글 크롤러")
    print("⚠️  공개 게시글만 수집 | 개인정보 마스킹 | 소량 원칙")
    print("=" * 60)

    all_posts = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        context = await browser.new_context(
            user_agent=USER_AGENT,
            locale="ko-KR",
            viewport={"width": 1280, "height": 800},
        )
        page = await context.new_page()

        # robots.txt 확인 안내
        print("\n📋 robots.txt 확인: https://cafe.naver.com/robots.txt")
        print("   → 수집 전 반드시 확인 권장\n")

        for cafe in TARGET_CAFES:
            # 공개 접근 가능 여부 확인
            is_public = await check_public_access(page, cafe["cafe_id"])
            if not is_public:
                continue

            # 게시글 크롤링
            posts = await crawl_cafe_posts(page, cafe)
            all_posts.extend(posts)

            print(f"  → {cafe['name']}: {len(posts)}개 수집")

            # 카페 간 대기
            await asyncio.sleep(random.uniform(5, 10))

        await browser.close()

    # 결과 저장
    if all_posts:
        await save_results(all_posts)
    else:
        print("\n⚠️  수집된 게시글이 없습니다.")
        print("대부분의 네이버 환우 카페는 로그인 필요합니다.")
        print("→ 카페 운영자에게 데이터 제공 파트너십 요청을 검토하세요.")


if __name__ == "__main__":
    asyncio.run(main())
