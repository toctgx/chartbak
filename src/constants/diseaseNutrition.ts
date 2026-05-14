// 차트밖 - 질환별 식단 가이드라인
// diseases.ts의 질환 ID와 매핑

export interface NutritionGuideline {
  diseaseId: string;
  diseaseName: string;
  avoid: string[];       // 피해야 할 식품
  recommended: string[]; // 권장 식품
  tips: string[];        // 식단 팁
}

export const NUTRITION_GUIDELINES: NutritionGuideline[] = [
  {
    diseaseId: 'diabetes',
    diseaseName: '당뇨',
    avoid: ['백미', '설탕', '과자', '탄산음료', '흰 빵', '감자튀김', '꿀', '시럽', '단 과일주스'],
    recommended: ['현미', '채소', '두부', '닭가슴살', '견과류', '고등어', '귀리', '브로콜리', '아몬드'],
    tips: ['혈당지수(GI) 낮은 식품 선택', '소량씩 자주 먹기', '식후 30분 산책', '탄수화물 섭취량 일정하게 유지'],
  },
  {
    diseaseId: 'hypertension',
    diseaseName: '고혈압',
    avoid: ['소금', '라면', '짠 음식', '훈제식품', '통조림', '가공육', '피클', '젓갈', '된장찌개(짠 것)'],
    recommended: ['바나나', '시금치', '고구마', '저지방 유제품', '연어', '귀리', '마늘', '올리브오일', '석류'],
    tips: ['하루 나트륨 2,000mg 이하', 'DASH 식단 참고', '칼륨 풍부한 채소·과일 섭취', '알코올 제한'],
  },
  {
    diseaseId: 'kidney',
    diseaseName: '신장질환·투석',
    avoid: ['바나나', '오렌지', '감자', '토마토', '견과류', '유제품 과다', '소금', '칼륨 높은 식품', '인 높은 식품'],
    recommended: ['백미', '배', '사과', '양배추', '콜리플라워', '흰빵(저인)', '닭가슴살(소량)', '달걀흰자'],
    tips: ['칼륨·인 섭취 제한', '단백질 섭취량 의사와 상의', '수분 섭취량 조절', '신장 전문 영양사 상담 권장'],
  },
  {
    diseaseId: 'gout',
    diseaseName: '통풍',
    avoid: ['맥주', '육류 내장(간·신장)', '멸치', '등푸른 생선(과다)', '새우', '조개류', '효모 식품', '과당 음료'],
    recommended: ['체리', '저지방 유제품', '달걀', '두부', '채소', '커피(적당량)', '물', '비타민C 풍부 식품'],
    tips: ['하루 물 2L 이상 마시기', '퓨린 함량 낮은 식품 선택', '체중 급격히 줄이지 않기', '알코올 특히 맥주 금지'],
  },
  {
    diseaseId: 'stomach_cancer',
    diseaseName: '위암',
    avoid: ['짠 음식', '훈제·절인 식품', '탄 음식', '맵고 자극적 음식', '술', '담배(식습관)', '가공육', '나트륨 과다'],
    recommended: ['신선한 채소', '과일', '통곡물', '생선', '마늘', '브로콜리', '양파', '녹차', '토마토'],
    tips: ['소량씩 자주 먹기', '천천히 꼭꼭 씹어 먹기', '식사 후 바로 눕지 않기', '신선식품 위주 식사'],
  },
  {
    diseaseId: 'colorectal_cancer',
    diseaseName: '대장암',
    avoid: ['붉은 육류(과다)', '가공육', '술', '정제 탄수화물', '설탕', '포화지방 많은 식품'],
    recommended: ['식이섬유 풍부한 채소', '과일', '통곡물', '콩류', '마늘', '생선', '올리브오일', '요거트'],
    tips: ['식이섬유 하루 25-30g 목표', '붉은 고기 주 2회 이하', '알코올 제한', '규칙적인 수분 섭취'],
  },
  {
    diseaseId: 'liver_disease',
    diseaseName: '간질환·간경화',
    avoid: ['알코올', '기름진 음식', '날 조개·어패류', '가공식품', '당분 과다', '소금(복수 있을 때)', '보충제 임의 복용'],
    recommended: ['단백질 적당량', '과일', '채소', '통곡물', '달걀', '저지방 단백질', '비타민B 풍부 식품'],
    tips: ['금주 필수', '소식 다끼 원칙', '단백질 섭취 의사와 조율', '복수 있으면 저염식'],
  },
  {
    diseaseId: 'crohns',
    diseaseName: '크론병·IBD',
    avoid: ['고지방 식품', '유제품(불내증시)', '생채소(악화기)', '씨앗 많은 과일', '탄산음료', '카페인', '알코올', '매운 음식'],
    recommended: ['부드럽게 익힌 채소', '감자', '쌀', '오트밀', '바나나', '닭가슴살', '연어', '두부'],
    tips: ['악화기엔 저섬유 연식', '음식 일기 써서 유발 식품 파악', '소량씩 자주 섭취', '수분 충분히 섭취'],
  },
  {
    diseaseId: 'pancreatitis',
    diseaseName: '췌장염',
    avoid: ['기름진 음식', '술', '튀긴 음식', '지방 함량 높은 식품', '탄산음료', '카페인', '향신료'],
    recommended: ['저지방 식품', '현미', '채소', '과일', '흰살 생선', '두부', '달걀흰자', '요거트(저지방)'],
    tips: ['지방 섭취 하루 30-50g 이하', '소량씩 5-6끼 분식', '금주 필수', '저지방 고탄수 위주'],
  },
  {
    diseaseId: 'heart_disease',
    diseaseName: '심장질환',
    avoid: ['포화지방(버터·베이컨)', '트랜스지방', '소금', '술', '설탕', '가공식품', '붉은 고기(과다)'],
    recommended: ['연어', '고등어', '아보카도', '올리브오일', '견과류', '통곡물', '베리류', '녹색 채소', '콩류'],
    tips: ['오메가-3 지방산 풍부한 식품 섭취', '지중해식 식단 참고', '나트륨 하루 2,000mg 이하', '금연·금주'],
  },
  {
    diseaseId: 'thyroid',
    diseaseName: '갑상선질환',
    avoid: ['생 십자화과 채소 과다(저하증시)', '콩류 과다(갑상선약과 간격)', '과도한 요오드', '글루텐(민감한 경우)'],
    recommended: ['해산물(적당량)', '달걀', '견과류', '베리류', '닭가슴살', '채소', '통곡물'],
    tips: ['갑상선약과 식품 섭취 간격 준수', '요오드 과부족 모두 주의', '균형 잡힌 식사가 기본', '의사·영양사 상담 권장'],
  },
  {
    diseaseId: 'gerd',
    diseaseName: '역류성식도염',
    avoid: ['커피', '초콜릿', '민트', '기름진 음식', '술', '탄산음료', '토마토', '감귤류', '매운 음식', '양파·마늘(과다)'],
    recommended: ['바나나', '멜론', '귀리', '생강', '채소', '닭가슴살', '생선', '저지방 유제품'],
    tips: ['식사 후 3시간 눕지 않기', '소량씩 먹기', '체중 조절', '수면 시 머리 높이기'],
  },
  {
    diseaseId: 'obesity',
    diseaseName: '비만·대사증후군',
    avoid: ['설탕', '정제 탄수화물', '튀긴 음식', '가공식품', '탄산음료', '주스', '과자', '패스트푸드'],
    recommended: ['채소', '단백질 식품', '통곡물', '과일(적당량)', '물', '저지방 유제품', '견과류(소량)'],
    tips: ['칼로리 섭취 조절', '단백질 섭취로 포만감 유지', '천천히 씹어 먹기', '규칙적인 식사 시간 유지'],
  },
];

// diseaseId로 가이드라인 조회
export function getNutritionGuideline(diseaseId: string): NutritionGuideline | undefined {
  return NUTRITION_GUIDELINES.find(g => g.diseaseId === diseaseId);
}

// 여러 질환의 가이드라인 조회
export function getNutritionGuidelines(diseaseIds: string[]): NutritionGuideline[] {
  return NUTRITION_GUIDELINES.filter(g => diseaseIds.includes(g.diseaseId));
}
