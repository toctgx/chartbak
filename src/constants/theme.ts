// 차트밖 × Hers Design System (v2)
// Sage Green + Soft Peach + Terracotta
// Pantone 참고: 7490 C (Sage), 488 C (Peach), 4985 C (Terracotta)
export const COLORS = {
  // ── Primary — Sage Green ───────────────────────────────
  primary: '#6B835B',          // Pantone 7490 C 유사 (Sage Green)
  primaryLight: '#C0DBA4',     // Light Sage
  primaryPale: '#EDF5E6',      // Very Light Sage (카드 강조 배경)
  primaryDark: '#4E6644',      // Deep Sage

  // ── Background ────────────────────────────────────────
  background: '#FAF7F4',       // Warm Off-White (Hers 시그니처)
  surface: '#FFFFFF',
  surfaceSecondary: '#F5EFE8', // Warm Cream

  // ── Text ──────────────────────────────────────────────
  textPrimary: '#2D2520',      // Warm Dark Brown
  textSecondary: '#7A6B60',    // Warm Gray
  textTertiary: '#B5A49A',     // Warm Light Gray
  textInverse: '#FFFFFF',

  // ── 역할 색상 ─────────────────────────────────────────
  patient: '#6B835B',          // Sage Green (환자)
  caregiver: '#A06B52',        // Terracotta (환우)

  // ── 상태 ──────────────────────────────────────────────
  success: '#6B835B',          // Sage
  warning: '#C8873D',          // Warm Orange
  error: '#C05252',
  info: '#6B835B',

  // ── 보조 색상 (Hers 브랜딩) ───────────────────────────
  peach: '#F1D1C5',            // Soft Peach (Pantone 488 C 유사)
  terracotta: '#D2A48C',       // Terracotta (Pantone 4985 C 유사)
  deepBrown: '#6A3627',        // Deep Terracotta

  // ── 구분선 ────────────────────────────────────────────
  border: '#E8DED5',           // Warm Beige
  borderDark: '#C8B8AD',
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
  md: 16,      // Hers — 더 둥글게
  lg: 24,
  xl: 32,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#2D2520',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#2D2520',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
};
