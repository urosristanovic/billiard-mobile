/**
 * Single source of truth for all design tokens in the mobile app.
 * This is the ONLY file that may contain hex color values.
 * All components consume tokens from this file -- never inline hex.
 *
 * Palette aligned with the web prototype (Tailwind amber + custom darks).
 */

const palette = {
  // Tailwind amber — primary accent
  primary: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Neutral scale — dark end uses the blue-tinted darks from the web prototype
  zinc: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#18181B',
    800: '#111114',
    900: '#0A0A0C',
    950: '#050505',
  },

  success: {
    light: '#052E16',
    default: '#22C55E',
    dark: '#041F10',
    text: '#4ADE80',
    border: '#166534',
  },
  error: {
    light: '#2A1111',
    default: '#EF4444',
    dark: '#190A0A',
    text: '#F87171',
    border: '#991B1B',
  },
  warning: {
    light: '#2B1A08',
    default: '#F97316',
    dark: '#1A1007',
    text: '#FB923C',
    border: '#9A3412',
  },
  info: {
    light: '#0C1929',
    default: '#3B82F6',
    dark: '#081321',
    text: '#60A5FA',
    border: '#1E40AF',
  },

  rating: {
    provisional: '#F59E0B',
    established: '#3B82F6',
    trendUp: '#22C55E',
    trendDown: '#EF4444',
    trendStable: '#6B7280',
  },

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

const lightTheme = {
  background: {
    primary: '#0A0A0C',
    secondary: '#111114',
    tertiary: '#18181B',
    overlay: 'rgba(0, 0, 0, 0.75)',
  },
  surface: {
    default: '#111114',
    raised: '#1A1A1F',
    overlay: '#222228',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.03)',
    default: 'rgba(255, 255, 255, 0.05)',
    strong: 'rgba(255, 255, 255, 0.10)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
    muted: '#6B7280',
    disabled: '#4B5563',
    inverse: '#0A0A0C',
    onPrimary: '#000000',
  },
  primary: palette.primary,
  primaryTint: {
    border: 'rgba(245,158,11,0.20)',
    glow: 'rgba(245,158,11,0.40)',
    labelMuted: 'rgba(251,191,36,0.70)',
  },
  success: palette.success,
  error: palette.error,
  warning: palette.warning,
  info: palette.info,
  rating: palette.rating,
} as const;

const darkTheme = {
  background: {
    primary: '#050505',
    secondary: '#0A0A0C',
    tertiary: '#111114',
    overlay: 'rgba(0, 0, 0, 0.80)',
  },
  surface: {
    default: '#0A0A0C',
    raised: '#111114',
    overlay: '#1A1A1F',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.03)',
    default: 'rgba(255, 255, 255, 0.05)',
    strong: 'rgba(255, 255, 255, 0.10)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
    muted: '#6B7280',
    disabled: '#4B5563',
    inverse: '#050505',
    onPrimary: '#000000',
  },
  primary: palette.primary,
  primaryTint: {
    border: 'rgba(245,158,11,0.20)',
    glow: 'rgba(245,158,11,0.40)',
    labelMuted: 'rgba(251,191,36,0.70)',
  },
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
    header: ['#111114', '#0A0A0C'] as string[],
    card: ['#1A1A1F', '#111114'] as string[],
    background: ['#0A0A0C', '#050505'] as string[],
    rating: [palette.primary[400], palette.primary[800]] as string[],
    hero: ['#1C160B', '#111114'] as string[],
  },
  dark: {
    header: ['#0A0A0C', '#050505'] as string[],
    card: ['#111114', '#0A0A0C'] as string[],
    background: ['#050505', '#030303'] as string[],
    rating: [palette.primary[500], palette.primary[800]] as string[],
    hero: ['#1C160B', '#111114'] as string[],
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
  24: 96,
  32: 128,
} as const;

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 20,
  '4xl': 24,
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
    xs: 14,
    sm: 16,
    base: 18,
    lg: 20,
    xl: 22,
    '2xl': 26,
    '3xl': 32,
    '4xl': 38,
    '5xl': 44,
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
  letterSpacing: {
    tight: 0.5,
    snug: 0.6,
    normal: 1,
    relaxed: 1.2,
    extraRelaxed: 1.4,
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
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const minTouchTarget = 44;
