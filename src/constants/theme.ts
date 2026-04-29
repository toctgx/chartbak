// 차트밖 × DocVisit Design System (v3)
// Bright Blue + Navy + Sky Blue
// Pantone 참고: 286 C (Blue), 282 C (Navy), 290 C (Sky Blue)
export const COLORS = {
  // ── Primary — Bright Blue ─────────────────────────────
  primary: '#0464F1',          // Pantone 286 C 유사 (Bright Blue)
  primaryLight: '#CBE6FC',     // Sky Blue (Pantone 290 C 유사)
  primaryPale: '#EFF6FF',      // Very Light Blue (카드 강조 배경)
  primaryDark: '#0350C0',      // Deep Blue

  // ── Background ────────────────────────────────────────
  background: '#F8FAFF',       // Very Light Blue-White
  surface: '#FFFFFF',
  surfaceSecondary: '#EFF5FF', // Light Blue-Gray

  // ── Text ──────────────────────────────────────────────
  textPrimary: '#133568',      // Dark Navy (Pantone 282 C 유사)
  textSecondary: '#5C7792',    // Slate Blue
  textTertiary: '#9DB2C7',     // Light Slate
  textInverse: '#FFFFFF',

  // ── 역할 색상 ─────────────────────────────────────────
  patient: '#0464F1',          // Bright Blue (환자)
  caregiver: '#7290AA',        // Slate Blue (환우)

  // ── 상태 ──────────────────────────────────────────────
  success: '#1A9E5C',          // Medical Green
  warning: '#E8940A',          // Warm Amber
  error: '#E53E3E',
  info: '#0464F1',

  // ── 보조 색상 (DocVisit 브랜딩) ───────────────────────
  navyDeep: '#0A2347',         // Deep Navy
  skyBlue: '#CBE6FC',          // Sky Blue
  slateBlue: '#7290AA',        // Slate Blue

  // ── 구분선 ────────────────────────────────────────────
  border: '#D6E4F3',           // Light Blue-Gray Border
  borderDark: '#A8C4DE',
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
  sm: 10,
  md: 14,
  lg: 20,      // DocVisit — 중간 radius
  xl: 28,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#133568',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#133568',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
};
