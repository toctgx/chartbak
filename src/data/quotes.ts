// 차트밖 — 명언 데이터베이스
// 한줄일기 "명언으로 응원하기" 기능에 사용

export type QuoteCategory =
  | 'fighting'    // 항암, 치료, 수술
  | 'courage'     // 두렵다, 무섭다, 불안
  | 'loneliness'  // 외롭다, 혼자
  | 'exhaustion'  // 힘들다, 지쳐
  | 'gratitude'   // 감사, 오늘, 버텼다
  | 'hope'        // 나을, 회복, 희망
  | 'general';    // 기본값

export interface Quote {
  text: string;
  author: string;
  categories: QuoteCategory[];
}

export const QUOTES: Quote[] = [
  // ── 투병/치료 (fighting) ───────────────────────────────
  {
    text: "고통은 지나가지만, 아름다움은 남는다.",
    author: "오귀스트 르누아르 (관절염으로 붓을 손에 묶으며 그림)",
    categories: ['fighting'],
  },
  {
    text: "살아 있는 것 자체가 용감한 행동이다.",
    author: "세네카",
    categories: ['fighting', 'courage'],
  },
  {
    text: "폭풍을 피하는 법은 없다. 폭풍 속에서 춤추는 법을 배울 뿐이다.",
    author: "셰릴 린 케년",
    categories: ['fighting', 'courage'],
  },
  {
    text: "최선을 다했다면, 결과가 어떻든 그것으로 충분하다.",
    author: "윈스턴 처칠",
    categories: ['fighting', 'exhaustion'],
  },
  {
    text: "우리가 싸울 때 가장 힘든 순간은, 포기하기 직전이다.",
    author: "H. 잭슨 브라운",
    categories: ['fighting'],
  },
  {
    text: "당신의 몸은 지금 싸우고 있다. 그 싸움을 응원한다.",
    author: "차트밖 커뮤니티",
    categories: ['fighting'],
  },

  // ── 용기/두려움 (courage) ──────────────────────────────
  {
    text: "용기란 두렵지 않은 것이 아니라, 두려움보다 더 중요한 것이 있다고 판단하는 것이다.",
    author: "앰브로스 레드문",
    categories: ['courage'],
  },
  {
    text: "가장 어두운 밤도 끝나고, 해는 뜬다.",
    author: "빅토르 위고",
    categories: ['courage', 'hope'],
  },
  {
    text: "두려움이 노크하면, 용기가 문을 열게 하라.",
    author: "마틴 루터 킹",
    categories: ['courage'],
  },
  {
    text: "불확실성을 받아들이는 것이 불안을 이기는 첫 번째 걸음이다.",
    author: "존 카밧진",
    categories: ['courage'],
  },
  {
    text: "두려운 것을 하라. 두려움은 그때 사라진다.",
    author: "엘리너 루스벨트",
    categories: ['courage'],
  },

  // ── 외로움/연대 (loneliness) ───────────────────────────
  {
    text: "별들은 가장 어두운 밤하늘에서 가장 밝게 빛난다.",
    author: "갈릴레오 갈릴레이",
    categories: ['loneliness', 'hope'],
  },
  {
    text: "혼자라고 느낄 때, 그 감정 자체가 당신이 연결을 원한다는 증거다.",
    author: "브레네 브라운",
    categories: ['loneliness'],
  },
  {
    text: "우리가 서로의 이야기를 듣는 것만으로도, 덜 외로워진다.",
    author: "메리 루 케이시",
    categories: ['loneliness'],
  },
  {
    text: "외로움은 약함이 아니라, 더 깊은 연결을 향한 갈망이다.",
    author: "헨리 나우웬",
    categories: ['loneliness'],
  },
  {
    text: "당신의 고통은 혼자만의 것이 아니다. 누군가 같은 밤을 버티고 있다.",
    author: "차트밖 커뮤니티",
    categories: ['loneliness'],
  },

  // ── 지침/회복 (exhaustion) ─────────────────────────────
  {
    text: "버티는 것도 나아가는 것이다.",
    author: "류시화",
    categories: ['exhaustion'],
  },
  {
    text: "오늘 살아낸 것, 그것으로 충분하다.",
    author: "혜민 스님",
    categories: ['exhaustion', 'gratitude'],
  },
  {
    text: "파도를 멈출 수는 없다. 하지만 서핑은 배울 수 있다.",
    author: "존 카밧진",
    categories: ['exhaustion'],
  },
  {
    text: "쉬는 것은 포기가 아니다. 다음을 위한 준비다.",
    author: "작자 미상",
    categories: ['exhaustion'],
  },
  {
    text: "당신이 지쳐있다면, 그만큼 열심히 살아왔다는 뜻이다.",
    author: "작자 미상",
    categories: ['exhaustion'],
  },
  {
    text: "계속 나아가라. 그것으로 충분하다.",
    author: "윈스턴 처칠",
    categories: ['exhaustion', 'fighting'],
  },

  // ── 감사/오늘 (gratitude) ──────────────────────────────
  {
    text: "살아있다는 것 자체가 기적이다.",
    author: "틱낫한",
    categories: ['gratitude', 'hope'],
  },
  {
    text: "오늘 하루, 숨 쉬는 것만으로도 충분히 잘 살았다.",
    author: "작자 미상",
    categories: ['gratitude', 'exhaustion'],
  },
  {
    text: "작은 것에 감사할 줄 아는 사람이 큰 것을 얻는다.",
    author: "윌리엄 워즈워스",
    categories: ['gratitude'],
  },
  {
    text: "오늘이라는 선물. 그래서 현재를 'present'라 부른다.",
    author: "작자 미상",
    categories: ['gratitude'],
  },

  // ── 희망/회복 (hope) ───────────────────────────────────
  {
    text: "봄이 오는 것을 막은 겨울은 없었다.",
    author: "랄프 왈도 에머슨",
    categories: ['hope'],
  },
  {
    text: "희망이 있는 곳에 길이 있다.",
    author: "마틴 루터 킹",
    categories: ['hope'],
  },
  {
    text: "끝이 있어야 새로운 시작이 있다.",
    author: "세네카",
    categories: ['hope'],
  },
  {
    text: "낮에는 용기를, 밤에는 희망을.",
    author: "빅토르 위고",
    categories: ['hope', 'courage'],
  },
  {
    text: "희망은 깃털처럼 가볍게, 폭풍 속에서도 날아오른다.",
    author: "에밀리 디킨슨",
    categories: ['hope'],
  },

  // ── 일반 (general) ────────────────────────────────────
  {
    text: "당신은 생각보다 훨씬 강하다.",
    author: "A.A. 밀른",
    categories: ['general'],
  },
  {
    text: "스스로를 믿어라. 당신이 생각하는 것보다 훨씬 많은 것을 해낼 수 있다.",
    author: "벤자민 스팍",
    categories: ['general'],
  },
  {
    text: "당신의 이야기는 아직 끝나지 않았다.",
    author: "작자 미상",
    categories: ['general'],
  },
  {
    text: "오늘 여기 있어줘서 고맙다.",
    author: "차트밖 커뮤니티",
    categories: ['general'],
  },
];

// ── 키워드 → 카테고리 매핑 ─────────────────────────────────
const KEYWORD_MAP: { keywords: string[]; category: QuoteCategory }[] = [
  {
    keywords: ['항암', '치료', '수술', '입원', '방사선', '항암제', '주사', '약', '병원', '검사', '진단', '항암치료', '차수'],
    category: 'fighting',
  },
  {
    keywords: ['두렵', '무서', '불안', '두려', '겁나', '떨려', '무섭', '걱정', '긴장'],
    category: 'courage',
  },
  {
    keywords: ['외롭', '혼자', '쓸쓸', '고립', '아무도', '홀로', '외로'],
    category: 'loneliness',
  },
  {
    keywords: ['힘들', '지쳐', '지친', '힘이 없', '피곤', '지쳤', '못하겠', '그만'],
    category: 'exhaustion',
  },
  {
    keywords: ['감사', '고마', '오늘도', '버텼', '다행', '살아남', '견뎌'],
    category: 'gratitude',
  },
  {
    keywords: ['나을', '희망', '나아질', '좋아질', '회복', '완치', '퇴원', '완료'],
    category: 'hope',
  },
];

/**
 * 일기 텍스트를 분석해서 관련 명언 count개를 랜덤으로 반환
 */
export function getRelevantQuotes(text: string, count = 3): Quote[] {
  const detectedCategories = new Set<QuoteCategory>();

  for (const { keywords, category } of KEYWORD_MAP) {
    if (keywords.some((kw) => text.includes(kw))) {
      detectedCategories.add(category);
    }
  }

  let pool: Quote[];
  if (detectedCategories.size > 0) {
    pool = QUOTES.filter((q) => q.categories.some((c) => detectedCategories.has(c)));
    // 풀이 너무 작으면 general 추가
    if (pool.length < count) {
      pool = [...pool, ...QUOTES.filter((q) => q.categories.includes('general'))];
    }
  } else {
    pool = QUOTES;
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
