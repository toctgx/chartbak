// 차트밖 × 네이비 글래스모피즘
// Deep Navy Blue + Black + White
export const COLORS = {
  // ── Primary — Deep Navy Blue ─────────────────────────
  primary: '#4B7FE8',          // 밝은 블루 (버튼 CTA)
  primaryLight: 'rgba(75,127,232,0.25)',
  primaryPale: 'rgba(75,127,232,0.12)',
  primaryDark: '#1A4FBF',

  // ── Background ──────────────────────────────────────
  background: '#060D1E',       // 딥 다크 네이비
  surface: 'rgba(15,45,120,0.18)',    // 네이비 글래스
  surfaceSecondary: 'rgba(15,45,120,0.10)',

  // ── Text ────────────────────────────────────────────
  textPrimary: '#F0F4FF',      // 쿨 화이트
  textSecondary: 'rgba(240,244,255,0.65)',
  textTertiary: 'rgba(240,244,255,0.35)',
  textInverse: '#060D1E',

  // ── 역할 색상 ───────────────────────────────────────
  patient: '#60A5FA',          // 환자 — 스카이 블루
  caregiver: '#34D399',        // 환우 — 민트 그린

  // ── 상태 ────────────────────────────────────────────
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // ── 보조 ────────────────────────────────────────────
  peach: 'rgba(75,127,232,0.15)',
  terracotta: '#1A4FBF',
  deepBrown: '#0F2D78',

  // ── 구분선 ──────────────────────────────────────────
  border: 'rgba(255,255,255,0.14)',
  borderDark: 'rgba(255,255,255,0.24)',
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
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
};
