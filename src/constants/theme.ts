// 병갔왔 디자인 시스템
export const COLORS = {
  // Primary - 따뜻하고 신뢰감 있는 블루
  primary: '#2E86DE',
  primaryLight: '#74B9FF',
  primaryDark: '#1A6BB5',

  // 배경
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F3F4',

  // 텍스트
  textPrimary: '#1A1A2E',
  textSecondary: '#6C757D',
  textTertiary: '#ADB5BD',
  textInverse: '#FFFFFF',

  // 공감 이모지 배경
  emojiBlue: '#EBF5FF',
  emojiGreen: '#EAFAF1',
  emojiOrange: '#FEF9E7',

  // 역할 색상
  patient: '#2E86DE',   // 환자 - 블루
  caregiver: '#27AE60', // 환우(보호자) - 그린

  // 상태
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',

  // 구분선
  border: '#E9ECEF',
  borderDark: '#DEE2E6',
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
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
