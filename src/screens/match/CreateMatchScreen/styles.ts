import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: spacing[4],
    gap: spacing[5],
    paddingBottom: spacing[6],
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreSection: {
    gap: spacing[2],
  },
  scoreLabelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  scoreField: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreLabelLeft: {
    flex: 1,
  },
  scoreLabelRight: {
    flex: 1,
    textAlign: 'right',
  },
  scoreButton: {
    borderWidth: 1,
    borderRadius: radius.lg,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
  },
  scoreAdjustButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreAdjustButtonText: {
    fontFamily: typography.family.heading,
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * 1.1,
  },
  scoreButtonValue: {
    fontFamily: typography.family.display,
    fontSize: typography.size['4xl'],
    lineHeight: typography.size['4xl'] * 1.15,
    textAlignVertical: 'center',
    paddingTop: 3,
  },
  vsWrap: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsLabelSpacer: {
    width: 28,
  },
  vsText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.display,
    letterSpacing: 0.8,
  },
  helperText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    marginTop: -spacing[3],
  },
  scoreError: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bodyMedium,
    marginTop: -spacing[3],
  },
  ratedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[3],
  },
  ratedInfo: {
    flex: 1,
    gap: 2,
  },
  ratedLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratedDesc: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  beerSection: {
    gap: spacing[2],
  },
  beerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  beerField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    gap: spacing[2],
  },
  beerLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  beerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  beerAdjustButton: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beerAdjustButtonText: {
    fontFamily: typography.family.heading,
    fontSize: typography.size.base,
    lineHeight: typography.size.base * 1.1,
  },
  beerValue: {
    fontFamily: typography.family.display,
    fontSize: typography.size.xl,
    minWidth: 28,
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderTopWidth: 1,
  },
});
