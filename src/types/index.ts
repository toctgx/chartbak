// 차트밖 - 타입 정의

export type UserRole = 'patient' | 'caregiver'; // 환자 | 환우(보호자)

export type PostType = 
  | 'treatment_experience'  // 치료 경험
  | 'unsaid_to_doctor'      // 의사에게 못 한 말
  | 'question'              // 질문
  | 'hospital_review';      // 병원/의사 후기

export type ReactionType = 
  | 'helpful'    // 💙 도움됐어요
  | 'same'       // 🤝 나도그래요
  | 'cheer';     // 💪 힘내세요

export interface User {
  id: string;
  phone_hash: string;
  nickname: string;
  role: UserRole;
  disease_ids: string[];
  age_group: string;        // '20대' | '30대' | ...
  diagnosis_year: number;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  author_nickname: string;
  author_role: UserRole;
  disease_id: string;
  post_type: PostType;
  title: string;
  content: string;
  reactions: {
    helpful: number;
    same: number;
    cheer: number;
  };
  comment_count: number;
  user_reaction?: ReactionType | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_nickname: string;
  author_role: UserRole;
  parent_id: string | null; // 대댓글
  content: string;
  reactions: {
    helpful: number;
    same: number;
    cheer: number;
  };
  created_at: string;
}

export interface Lounge {
  id: string;
  disease_id: string;
  disease_name: string;
  category: string;
  emoji: string;
  member_count: number;
  post_count: number;
  recent_posts?: Post[];
}

export const POST_TYPE_LABELS: Record<PostType, string> = {
  treatment_experience: '치료 경험',
  unsaid_to_doctor: '의사에게 못 한 말',
  question: '질문',
  hospital_review: '병원/의사 후기',
};

export const POST_TYPE_EMOJIS: Record<PostType, string> = {
  treatment_experience: '💊',
  unsaid_to_doctor: '💬',
  question: '❓',
  hospital_review: '🏥',
};

export const REACTION_LABELS: Record<ReactionType, string> = {
  helpful: '💙 도움됐어요',
  same: '🤝 나도그래요',
  cheer: '💪 힘내세요',
};

export const AGE_GROUPS = ['10대', '20대', '30대', '40대', '50대', '60대', '70대 이상'];

// ── 식단 분석 ─────────────────────────────────────────────
export interface DietEntry {
  id: string;
  author_id: string;
  imageUri?: string;
  description: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  created_at: string;
  analysis?: import('../lib/dietAI').DietAnalysisResult;
  isAnalyzing?: boolean;
}

export const MEAL_TYPE_LABELS: Record<DietEntry['meal_type'], string> = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식',
};
