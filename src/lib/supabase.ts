import { createClient } from '@supabase/supabase-js';

// Supabase 환경변수 (실제 값은 .env에서 관리)
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 희망적인 단어 조합 닉네임 생성
const HOPEFUL_ADJECTIVES = [
  '따뜻한', '희망찬', '용기있는', '밝은', '든든한', '씩씩한', '강한',
  '새로운', '맑은', '빛나는', '잔잔한', '평온한', '다정한', '고요한',
  '포근한', '유연한', '단단한', '차분한', '생기있는', '산뜻한',
];

const HOPEFUL_NOUNS = [
  '별빛', '새벽', '봄날', '햇살', '꽃잎', '나비', '무지개', '달빛',
  '바람', '구름', '파도', '숲길', '강가', '언덕', '여정', '동행',
  '발걸음', '이야기', '기억', '하늘', '노을', '새벽빛', '봄바람',
];

export const generateNickname = (_diseaseName: string): string => {
  const adj = HOPEFUL_ADJECTIVES[Math.floor(Math.random() * HOPEFUL_ADJECTIVES.length)];
  const noun = HOPEFUL_NOUNS[Math.floor(Math.random() * HOPEFUL_NOUNS.length)];
  const num = Math.floor(10 + Math.random() * 90); // 2자리 숫자만
  return `${adj}${noun}${num}`;
};

// 전화번호 해시 (실제로는 서버에서 처리해야 하지만 MVP용 클라이언트 시뮬레이션)
export const hashPhone = (phone: string): string => {
  // MVP: 전화번호 마스킹 (실제 구현 시 서버사이드 bcrypt/SHA256 사용)
  return `hashed_${phone.slice(-4)}`;
};
