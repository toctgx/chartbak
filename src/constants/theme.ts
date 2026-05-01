// 차트밖 × 글래스모피즘 v2
// Dark Olive Green + Amber Accent + Glass
export const COLORS = {
  // ── Primary — Amber ─────────────────────────────────
  primary: '#E8A838',
  primaryLight: 'rgba(232,168,56,0.25)',
  primaryPale: 'rgba(232,168,56,0.12)',
  primaryDark: '#D4921E',

  // ── Background ──────────────────────────────────────
  background: '#2B3820',
  surface: 'rgba(255,255,255,0.09)',
  surfaceSecondary: 'rgba(255,255,255,0.05)',

  // ── Text ────────────────────────────────────────────
  textPrimary: '#F0EDE8',
  textSecondary: 'rgba(240,237,232,0.65)',
  textTertiary: 'rgba(240,237,232,0.35)',
  textInverse: '#2B3820',

  // ── 역할 색상 ───────────────────────────────────────
  patient: '#60A5FA',
  caregiver: '#34D399',

  // ── 상태 ────────────────────────────────────────────
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // ── 보조 ────────────────────────────────────────────
  peach: 'rgba(232,168,56,0.15)',
  terracotta: '#D4921E',
  deepBrown: '#B87E20',

  // ── 구분선 ──────────────────────────────────────────
  border: 'rgba(255,255,255,0.16)',
  borderDark: 'rgba(255,255,255,0.28)',
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
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
};
