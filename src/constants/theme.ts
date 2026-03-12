/**
 * Single source of truth for all design tokens in the mobile app.
 * This is the ONLY file that may contain hex color values.
 * All components consume tokens from this file -- never inline hex.
 */

const palette = {
  // Championship gold
  primary: {
    50: '#FFF8E7',
    100: '#FFEFC7',
    200: '#FFE19A',
    300: '#FFD06A',
    400: '#FFBE3D',
    500: '#F5A623',
    600: '#DE920F',
    700: '#C17D10',
    800: '#9B640D',
    900: '#7A4A00',
  },

  // Carbon neutrals
  zinc: {
    50: '#F5F5F5',
    100: '#E5E5E5',
    200: '#D4D4D4',
    300: '#B5B5B5',
    400: '#888888',
    500: '#666666',
    600: '#444444',
    700: '#2A2A2A',
    800: '#1A1A1A',
    900: '#111111',
    950: '#0A0A0A',
  },

  success: {
    light: '#2A1E09',
    default: '#F5A623',
    dark: '#1A1408',
    text: '#FFD06A',
    border: '#9B640D',
  },
  error: {
    light: '#2A1111',
    default: '#E53935',
    dark: '#190A0A',
    text: '#FF7A76',
    border: '#8A1F1C',
  },
  warning: {
    light: '#2B1A08',
    default: '#FF6D00',
    dark: '#1A1007',
    text: '#FFB06E',
    border: '#9A4600',
  },
  info: {
    light: '#111D2A',
    default: '#3FA9F5',
    dark: '#0A121A',
    text: '#73C2FF',
    border: '#1E5E8C',
  },

  rating: {
    provisional: '#F5A623',
    established: '#3FA9F5',
    trendUp: '#22C55E',
    trendDown: '#E53935',
    trendStable: '#888888',
  },

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

const lightTheme = {
  background: {
    primary: '#120D06',
    secondary: '#181108',
    tertiary: '#22170A',
    overlay: 'rgba(0, 0, 0, 0.75)',
  },
  surface: {
    default: '#1A1A1A',
    raised: '#222222',
    overlay: '#2A2A2A',
  },
  border: {
    subtle: '#2A2A2A',
    default: '#333333',
    strong: '#444444',
  },
  text: {
    primary: '#F5F5F5',
    secondary: '#B5B5B5',
    muted: '#888888',
    disabled: '#666666',
    inverse: '#111111',
    onPrimary: '#090909',
  },
  primary: palette.primary,
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
  info: palette.info,
  rating: palette.rating,
} as const;

const darkTheme = {
  background: {
    primary: palette.zinc[950],
    secondary: palette.zinc[900],
    tertiary: palette.zinc[800],
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  surface: {
    default: '#141414',
    raised: '#1C1C1C',
    overlay: '#222222',
  },
  border: {
    subtle: '#2A2A2A',
    default: '#333333',
    strong: '#444444',
  },
  text: {
    primary: '#F5F5F5',
    secondary: '#AAAAAA',
    muted: '#666666',
    disabled: '#4F4F4F',
    inverse: '#0F0F0F',
    onPrimary: '#090909',
  },
  primary: palette.primary,
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
  info: palette.info,
  rating: palette.rating,
} as const;

export const theme = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeMode = keyof typeof theme;
export type Theme = typeof lightTheme;

export const gradients = {
  light: {
    header: ['#1F1508', '#0E0A05'] as string[],
    card: ['#232323', '#171717'] as string[],
    background: ['#161008', '#090909'] as string[],
    rating: [palette.primary[400], palette.primary[800]] as string[],
  },
  dark: {
    header: ['#1A1A1A', '#0A0A0A'] as string[],
    card: ['#1A1A1A', '#111111'] as string[],
    background: ['#111111', '#0A0A0A'] as string[],
    rating: [palette.primary[500], palette.primary[800]] as string[],
  },
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
} as const;

export const typography = {
  family: {
    display: 'Oswald_700Bold',
    heading: 'Oswald_600SemiBold',
    body: 'Barlow_400Regular',
    bodyMedium: 'Barlow_500Medium',
    bodySemibold: 'Barlow_600SemiBold',
    bodyBold: 'Barlow_700Bold',
  },
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 5,
  },
  lg: {
    shadowColor: '#C17D10',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const minTouchTarget = 44;
