import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
    gap: spacing[5],
  },
  iconContainer: {
    width: 112,
    height: 112,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  icon: {
    fontSize: 44,
    lineHeight: 52,
    textAlign: 'center',
  },
  slideTitle: {
    fontSize: typography.size['3xl'],
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  divider: {
    width: 56,
    height: 2,
  },
  slideDescription: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
    lineHeight: typography.size.base * 1.625,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
    gap: spacing[6],
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  skipButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
  },
  skipText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextButton: {
    flex: 1,
  },
});
