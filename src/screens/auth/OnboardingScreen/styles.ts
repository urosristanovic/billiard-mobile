import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';
import { scale, moderateScale } from '@/utils/scale';

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
    width: scale(112),
    height: scale(112),
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  icon: {
    fontSize: moderateScale(44, 0.25),
    lineHeight: moderateScale(52, 0.25),
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
    width: scale(56),
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
    height: scale(8),
    borderRadius: radius.full,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  nextButton: {
    flex: 1,
  },
});
