import { createClient } from '@supabase/supabase-js';

// Supabase 환경변수 (실제 값은 .env에서 관리)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 닉네임 자동 생성 (질환명_숫자4자리)
export const generateNickname = (diseaseName: string): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${diseaseName}_${randomNum}`;
};

// 전화번호 해시 (실제로는 서버에서 처리해야 하지만 MVP용 클라이언트 시뮬레이션)
export const hashPhone = (phone: string): string => {
  // MVP: 전화번호 마스킹 (실제 구현 시 서버사이드 bcrypt/SHA256 사용)
  return `hashed_${phone.slice(-4)}`;
};
