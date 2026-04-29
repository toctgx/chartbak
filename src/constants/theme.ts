// 차트밖 × Niva 디자인 시스템
export const COLORS = {
  // ── Primary — Warm Amber (Niva 기반) ──────────────────
  primary: '#E8A838',          // 주 액션 색상 — 버튼, 활성 탭
  primaryLight: '#FCE2A2',     // 하이라이트 배경, 탭 활성 박스
  primaryPale: '#FEF6E4',      // 카드 강조 배경
  primaryDark: '#B87E20',      // 눌렸을 때

  // ── Background ────────────────────────────────────────
  background: '#FAF8F5',       // 크림 화이트 (Niva) — 차가운 #F8F9FA 대신
  surface: '#FFFFFF',
  surfaceSecondary: '#F3EFE9', // 따뜻한 보조 배경

  // ── Text ──────────────────────────────────────────────
  textPrimary: '#252728',      // Deep Charcoal (Niva)
  textSecondary: '#71747C',
  textTertiary: '#B0B3BB',
  textInverse: '#FFFFFF',

  // ── 역할 색상 ─────────────────────────────────────────
  patient: '#3B82F6',          // 환자 — 블루
  caregiver: '#22C55E',        // 환우 — 그린

  // ── 상태 ──────────────────────────────────────────────
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // ── 구분선 / 보조 ─────────────────────────────────────
  border: '#EDE6DF',           // 따뜻한 베이지 톤 구분선 (Niva)
  borderDark: '#C6B8A9',       // 더 진한 베이지
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
  lg: 22,      // Niva — 더 큰 radius
  xl: 28,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#252728',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#252728',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
};
// cache-bust-1777439784
