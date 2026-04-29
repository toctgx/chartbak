// 차트밖 - 질환별 라운지
// 네이버 카페 커뮤니티 규모 기반으로 선정
export interface Disease {
  id: string;
  name: string;
  category: DiseaseCategory;
  emoji: string;
  description: string;
  cafeMembers?: number; // 네이버 카페 1위 기준 회원수
}

export type DiseaseCategory =
  | '암'
  | '만성질환'
  | '자가면역·희귀질환'
  | '여성건강'
  | '정신건강'
  | '피부질환'
  | '호흡기·심혈관'
  | '소화기'
  | '근골격·신경계'
  | '혈액·림프'
  | '기타';

export const DISEASES: Disease[] = [
  // ── 암 ──────────────────────────────────────────────────
  { id: 'breast_cancer',     name: '유방암',       category: '암', emoji: '🎗️', description: '유방암 환자·환우', cafeMembers: 195192 },
  { id: 'thyroid_cancer',    name: '갑상선암',      category: '암', emoji: '🦋', description: '갑상선암 환자·환우', cafeMembers: 320024 },
  { id: 'lung_cancer',       name: '폐암',          category: '암', emoji: '🫁', description: '폐암 환자·환우', cafeMembers: 230054 },
  { id: 'stomach_cancer',    name: '위암',          category: '암', emoji: '🫙', description: '위암 환자·환우', cafeMembers: 266214 },
  { id: 'colorectal_cancer', name: '대장암',        category: '암', emoji: '🔵', description: '대장암 환자·환우', cafeMembers: 266214 },
  { id: 'liver_cancer',      name: '간암',          category: '암', emoji: '🟤', description: '간암·간질환 환자·환우' },
  { id: 'cervical_cancer',   name: '자궁경부암',    category: '암', emoji: '🌸', description: '자궁경부암·난소암 환자·환우' },
  { id: 'prostate_cancer',   name: '전립선암',      category: '암', emoji: '🔷', description: '전립선암 환자·환우' },
  { id: 'pancreatic_cancer', name: '췌장암',        category: '암', emoji: '🟡', description: '췌장암 환자·환우' },
  { id: 'brain_tumor',       name: '뇌종양',        category: '암', emoji: '🧠', description: '뇌종양 환자·환우' },
  { id: 'leukemia',          name: '혈액암·림프종', category: '암', emoji: '🩸', description: '백혈병·림프종·다발골수종', cafeMembers: 16017 },

  // ── 만성질환 ───────────────────────────────────────────
  { id: 'diabetes',          name: '당뇨',          category: '만성질환', emoji: '💉', description: '당뇨병 1형·2형 환자·환우', cafeMembers: 318692 },
  { id: 'hypertension',      name: '고혈압',        category: '만성질환', emoji: '❤️', description: '고혈압 환자·환우' },
  { id: 'kidney',            name: '신장질환·투석', category: '만성질환', emoji: '🫘', description: '만성신부전·투석·이식', cafeMembers: 229007 },
  { id: 'thyroid',           name: '갑상선질환',    category: '만성질환', emoji: '🦋', description: '갑상선항진·저하·결절', cafeMembers: 320024 },
  { id: 'gout',              name: '통풍',          category: '만성질환', emoji: '🦶', description: '통풍·고요산혈증 환자·환우' },
  { id: 'chronic_fatigue',   name: '만성피로증후군', category: '만성질환', emoji: '😴', description: '만성피로·섬유근육통' },
  { id: 'chronic_pain',      name: '만성통증',      category: '만성질환', emoji: '🔥', description: '만성통증·신경통' },
  { id: 'obesity',           name: '비만·대사증후군', category: '만성질환', emoji: '⚖️', description: '비만·대사증후군 관리' },

  // ── 자가면역·희귀질환 ──────────────────────────────────
  { id: 'lupus',             name: '루푸스',        category: '자가면역·희귀질환', emoji: '🌕', description: '전신홍반루푸스 환자·환우', cafeMembers: 35575 },
  { id: 'rheumatoid_arthritis', name: '류마티스관절염', category: '자가면역·희귀질환', emoji: '🦴', description: '류마티스관절염 환자·환우' },
  { id: 'ankylosing',        name: '강직성척추염',  category: '자가면역·희귀질환', emoji: '🦾', description: '강직성척추염 환자·환우', cafeMembers: 30336 },
  { id: 'ms',                name: '다발성경화증',  category: '자가면역·희귀질환', emoji: '⚡', description: '다발성경화증 환자·환우', cafeMembers: 1638 },
  { id: 'sjogren',           name: '쇼그렌증후군',  category: '자가면역·희귀질환', emoji: '💧', description: '쇼그렌증후군 환자·환우' },
  { id: 'scleroderma',       name: '전신경화증',    category: '자가면역·희귀질환', emoji: '🪨', description: '전신경화증 환자·환우' },
  { id: 'muscular_disease',  name: '근육병',        category: '자가면역·희귀질환', emoji: '💪', description: '근육병·근위축증 환자·환우' },
  { id: 'rare_disease',      name: '희귀·난치질환', category: '자가면역·희귀질환', emoji: '🌟', description: '희귀·난치성질환 환자·환우' },

  // ── 여성건강 ───────────────────────────────────────────
  { id: 'infertility',       name: '난임·불임',     category: '여성건강', emoji: '🌱', description: '난임·시험관·인공수정', cafeMembers: 137836 },
  { id: 'uterine_fibroid',   name: '자궁근종·낭종', category: '여성건강', emoji: '🌸', description: '자궁근종·난소낭종·선근증', cafeMembers: 256205 },
  { id: 'endometriosis',     name: '자궁내막증',    category: '여성건강', emoji: '🩷', description: '자궁내막증·생리통 환자·환우' },
  { id: 'menopause',         name: '갱년기',        category: '여성건강', emoji: '🌺', description: '갱년기·폐경 관련 경험 공유' },
  { id: 'gestational_dm',    name: '임신성당뇨',    category: '여성건강', emoji: '🤰', description: '임신성당뇨·임신합병증', cafeMembers: 90721 },

  // ── 정신건강 ───────────────────────────────────────────
  { id: 'depression',        name: '우울증',        category: '정신건강', emoji: '🌧️', description: '우울증 환자·환우', cafeMembers: 134832 },
  { id: 'anxiety',           name: '불안장애·공황', category: '정신건강', emoji: '🌊', description: '공황장애·불안장애', cafeMembers: 137938 },
  { id: 'bipolar',           name: '조울증·조현증', category: '정신건강', emoji: '🌓', description: '조울증·조현병 환자·환우' },
  { id: 'insomnia',          name: '수면장애',      category: '정신건강', emoji: '😴', description: '불면증·수면장애 경험 공유', cafeMembers: 47527 },
  { id: 'adhd',              name: 'ADHD',          category: '정신건강', emoji: '⚡', description: 'ADHD 환자·환우' },
  { id: 'autism',            name: '자폐스펙트럼',  category: '정신건강', emoji: '🧩', description: '자폐스펙트럼 환자·환우' },

  // ── 피부질환 ───────────────────────────────────────────
  { id: 'atopy',             name: '아토피',        category: '피부질환', emoji: '🌿', description: '아토피 피부염 환자·환우', cafeMembers: 168006 },
  { id: 'psoriasis',         name: '건선',          category: '피부질환', emoji: '🍂', description: '건선 환자·환우', cafeMembers: 168006 },
  { id: 'eczema',            name: '습진·두드러기', category: '피부질환', emoji: '🔴', description: '습진·두드러기·지루성 피부염' },
  { id: 'alopecia',          name: '탈모',          category: '피부질환', emoji: '💆', description: '탈모 관련 경험 공유' },

  // ── 호흡기·심혈관 ─────────────────────────────────────
  { id: 'heart_disease',     name: '심장질환',      category: '호흡기·심혈관', emoji: '💗', description: '심장질환·부정맥 환자·환우' },
  { id: 'stroke',            name: '뇌졸중',        category: '호흡기·심혈관', emoji: '🧠', description: '뇌졸중·뇌경색 환자·환우' },
  { id: 'copd',              name: 'COPD·폐질환',   category: '호흡기·심혈관', emoji: '🫁', description: 'COPD·천식·기관지 환자·환우' },
  { id: 'asthma',            name: '천식',          category: '호흡기·심혈관', emoji: '💨', description: '천식·알레르기 환자·환우' },

  // ── 소화기 ─────────────────────────────────────────────
  { id: 'crohns',            name: '크론병·IBD',    category: '소화기', emoji: '🌀', description: '크론병·궤양성대장염', cafeMembers: 14555 },
  { id: 'liver_disease',     name: '간질환·간경화', category: '소화기', emoji: '🟤', description: '간염·간경화·지방간 환자·환우' },
  { id: 'pancreatitis',      name: '췌장염',        category: '소화기', emoji: '🟡', description: '췌장염·소화기 환자·환우' },
  { id: 'gerd',              name: '역류성식도염',  category: '소화기', emoji: '🔥', description: '역류성식도염·위염 경험 공유' },

  // ── 근골격·신경계 ─────────────────────────────────────
  { id: 'parkinsons',        name: '파킨슨병',      category: '근골격·신경계', emoji: '🤲', description: '파킨슨병 환자·환우', cafeMembers: 42881 },
  { id: 'dementia',          name: '치매',          category: '근골격·신경계', emoji: '🧓', description: '치매·알츠하이머 환자·보호자', cafeMembers: 104042 },
  { id: 'herniated_disc',    name: '디스크·척추',   category: '근골격·신경계', emoji: '🦴', description: '허리·목 디스크 환자·환우' },
  { id: 'als',               name: '루게릭병',      category: '근골격·신경계', emoji: '💫', description: '루게릭병·ALS 환자·환우' },
  { id: 'epilepsy',          name: '뇌전증·간질',   category: '근골격·신경계', emoji: '⚡', description: '뇌전증 환자·환우' },
  { id: 'fibromyalgia',      name: '섬유근육통',    category: '기타', emoji: '💫', description: '섬유근육통 환자·환우' },
];

export const DISEASE_CATEGORIES: DiseaseCategory[] = [
  '암',
  '만성질환',
  '자가면역·희귀질환',
  '여성건강',
  '정신건강',
  '피부질환',
  '호흡기·심혈관',
  '소화기',
  '근골격·신경계',
  '혈액·림프',
  '기타',
];

// 회원수 기준 상위 질환 (라운지 추천용)
export const TOP_DISEASES_BY_COMMUNITY = DISEASES
  .filter(d => d.cafeMembers)
  .sort((a, b) => (b.cafeMembers || 0) - (a.cafeMembers || 0));
