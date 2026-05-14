// Wellness Aging Care Design System — Indigo + Yellow + Lavender
export const COLORS = {
  // ── Brand ────────────────────────────────────────────
  primary: '#3D3D8F',
  primaryDark: '#2F2F7A',
  primaryLight: 'rgba(61,61,143,0.15)',
  accent: '#F5D547',
  accentDark: '#DFC02E',
  accentLight: 'rgba(245,213,71,0.18)',

  // ── Backgrounds ──────────────────────────────────────
  surface: '#FFFFFF',
  background: '#EEEEF8',
  lavender: '#D8D5F0',

  // ── Text ────────────────────────────────────────────
  textPrimary: '#1A1B4B',
  textSecondary: '#9B9BC4',
  textOnDark: '#FFFFFF',
  textOnDarkSoft: 'rgba(255,255,255,0.65)',
  textOnAccent: '#1A1B4B',

  // ── Borders ─────────────────────────────────────────
  border: 'rgba(255,255,255,0.12)',
  borderCard: 'rgba(0,0,0,0.06)',

  // ── Role colors ────────────────────────────────────
  patient: '#F5D547',
  caregiver: 'rgba(255,255,255,0.75)',

  // ── States ──────────────────────────────────────────
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',

  // ── Backward-compat aliases (do not use in new code) ─
  primaryPale: 'rgba(245,213,71,0.15)',
  surfaceSecondary: '#EEEEF8',
  borderDark: 'rgba(0,0,0,0.12)',
  textTertiary: '#9B9BC4',
  textInverse: '#FFFFFF',
  info: 'rgba(61,61,143,0.55)',
};

export const FONTS = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
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
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  full: 999,
};

export const SHADOWS = {
  card: {
    shadowColor: '#3D3D8F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
  tabBar: {
    shadowColor: '#3D3D8F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  // aliases
  sm: {
    shadowColor: '#3D3D8F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#3D3D8F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
};
