// 병갔왔 - 질환별 라운지 20개 (MVP 기준)
export interface Disease {
  id: string;
  name: string;
  category: DiseaseCategory;
  emoji: string;
  description: string;
}

export type DiseaseCategory = '암' | '만성질환' | '희귀질환' | '정신건강' | '기타';

export const DISEASES: Disease[] = [
  // 암 (5개)
  { id: 'breast_cancer', name: '유방암', category: '암', emoji: '🎗️', description: '유방암 환자·환우 모임' },
  { id: 'lung_cancer', name: '폐암', category: '암', emoji: '🫁', description: '폐암 환자·환우 모임' },
  { id: 'colorectal_cancer', name: '대장암', category: '암', emoji: '🏥', description: '대장암 환자·환우 모임' },
  { id: 'thyroid_cancer', name: '갑상선암', category: '암', emoji: '🦋', description: '갑상선암 환자·환우 모임' },
  { id: 'stomach_cancer', name: '위암', category: '암', emoji: '💊', description: '위암 환자·환우 모임' },

  // 만성질환 (5개)
  { id: 'diabetes', name: '당뇨', category: '만성질환', emoji: '🩸', description: '당뇨 환자·환우 모임' },
  { id: 'hypertension', name: '고혈압', category: '만성질환', emoji: '❤️', description: '고혈압 환자·환우 모임' },
  { id: 'rheumatoid_arthritis', name: '류마티스관절염', category: '만성질환', emoji: '🦴', description: '류마티스관절염 환자·환우 모임' },
  { id: 'lupus', name: '루푸스', category: '만성질환', emoji: '🌕', description: '루푸스 환자·환우 모임' },
  { id: 'crohns', name: '크론병', category: '만성질환', emoji: '🌀', description: '크론병 환자·환우 모임' },

  // 희귀질환 (3개)
  { id: 'parkinsons', name: '파킨슨', category: '희귀질환', emoji: '🧠', description: '파킨슨 환자·환우 모임' },
  { id: 'ms', name: '다발성경화증', category: '희귀질환', emoji: '⚡', description: '다발성경화증 환자·환우 모임' },
  { id: 'muscular_disease', name: '근육병', category: '희귀질환', emoji: '💪', description: '근육병 환자·환우 모임' },

  // 정신건강 (2개)
  { id: 'depression', name: '우울증', category: '정신건강', emoji: '🌧️', description: '우울증 환자·환우 모임' },
  { id: 'anxiety', name: '불안장애', category: '정신건강', emoji: '🌊', description: '불안장애 환자·환우 모임' },

  // 기타 (5개)
  { id: 'infertility', name: '불임·난임', category: '기타', emoji: '🌱', description: '불임·난임 환자·환우 모임' },
  { id: 'chronic_pain', name: '만성통증', category: '기타', emoji: '🔥', description: '만성통증 환자·환우 모임' },
  { id: 'thyroid', name: '갑상선질환', category: '기타', emoji: '🦋', description: '갑상선질환 환자·환우 모임' },
  { id: 'kidney', name: '신장질환', category: '기타', emoji: '🫘', description: '신장질환 환자·환우 모임' },
  { id: 'fibromyalgia', name: '섬유근육통', category: '기타', emoji: '💫', description: '섬유근육통 환자·환우 모임' },
];

export const DISEASE_CATEGORIES: DiseaseCategory[] = ['암', '만성질환', '희귀질환', '정신건강', '기타'];
