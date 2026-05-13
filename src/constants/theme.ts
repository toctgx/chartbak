// 차트밖 v3 — Light Mode / Warm Neutral
// 차분하고 읽기 편한 커뮤니티 앱

export const COLORS = {
  // ── Brand ────────────────────────────────────────────
  // 올리브 그린 계열 1색 — CTA / 액티브 상태에만 사용
  primary: '#4A6741',
  primaryLight: 'rgba(74,103,65,0.12)',
  primaryPale: 'rgba(74,103,65,0.06)',
  primaryDark: '#3A5130',

  // ── Background ──────────────────────────────────────
  // 순수 흰색이 아닌 따뜻한 크림 — 눈이 편안함
  background: '#F5F3EF',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0EDE8',

  // ── Text ────────────────────────────────────────────
  // 순수 블랙 대신 87% 불투명 — 크림 배경과 온도 맞춤
  textPrimary: 'rgba(0,0,0,0.87)',
  textSecondary: 'rgba(0,0,0,0.50)',
  textTertiary: 'rgba(0,0,0,0.32)',
  textInverse: '#FFFFFF',

  // ── 역할 색상 ───────────────────────────────────────
  // 색을 줄이고 아이콘+텍스트로만 구분
  // 아주 옅은 차별화만 유지
  patient: '#4A6741',    // 올리브 그린 (환자)
  caregiver: '#6B7280',  // 중립 슬레이트 (환우/보호자)

  // ── 상태 ────────────────────────────────────────────
  success: '#4A6741',
  warning: '#92600A',
  error: '#B91C1C',
  info: 'rgba(0,0,0,0.55)',

  // ── 구분선 ──────────────────────────────────────────
  border: 'rgba(0,0,0,0.08)',
  borderDark: 'rgba(0,0,0,0.14)',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 999,
};

export const SHADOWS = {
  // 스택 섀도우 — 단일 무거운 그림자 대신 2겹 저알파
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
};
