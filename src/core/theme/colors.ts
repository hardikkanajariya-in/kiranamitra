export const Colors = {
  // Primary — Deep Green (Kirana/grocery feel)
  primary: '#2E7D32',
  primaryLight: '#60AD5E',
  primaryDark: '#005005',
  onPrimary: '#FFFFFF',

  // Secondary — Amber
  secondary: '#F9A825',
  secondaryLight: '#FFD95A',
  secondaryDark: '#C17900',
  onSecondary: '#000000',

  // Tertiary — Blue
  tertiary: '#0277BD',
  tertiaryLight: '#58A5F0',
  tertiaryDark: '#004C8C',
  onTertiary: '#FFFFFF',

  // Error
  error: '#D32F2F',
  errorLight: '#FF6659',
  errorDark: '#9A0007',
  onError: '#FFFFFF',

  // Success
  success: '#388E3C',
  successLight: '#6ABF69',
  successDark: '#00600F',

  // Warning
  warning: '#F57C00',
  warningLight: '#FFB74D',
  warningDark: '#E65100',

  // Info
  info: '#0288D1',
  infoLight: '#5EB8FF',
  infoDark: '#005B9F',

  // Neutral
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  outline: '#79747E',
  onBackground: '#1C1B1F',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',

  // Dark theme overrides
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    onBackground: '#E6E1E5',
    onSurface: '#E6E1E5',
    onSurfaceVariant: '#CAC4D0',
    primary: '#81C784',
    secondary: '#FFD54F',
    tertiary: '#4FC3F7',
  },

  // Stock level colors
  stockOk: '#4CAF50',
  stockLow: '#FF9800',
  stockOut: '#F44336',

  // Credit colors
  creditRed: '#E53935',
  paymentGreen: '#43A047',
} as const;
