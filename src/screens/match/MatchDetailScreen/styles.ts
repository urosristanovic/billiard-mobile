import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    gap: spacing[4],
  },
  metaBadges: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    gap: spacing[2],
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.md,
  },
  badgeText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  date: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    paddingBottom: spacing[3],
  },
  actions: {
    gap: spacing[3],
  },
  challengeScoreCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  challengeScoreTitle: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  challengeScoreSection: {
    gap: spacing[2],
  },
  challengeScoreLabelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  challengeScoreLabel: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  challengeScoreLabelLeft: {
    flex: 1,
  },
  challengeScoreLabelRight: {
    flex: 1,
    textAlign: 'right',
  },
  challengeVsLabelSpacer: {
    width: 28,
  },
  challengeScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  challengeScoreField: {
    flex: 1,
  },
  challengeScoreButton: {
    borderWidth: 1,
    borderRadius: radius.lg,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
  },
  challengeScoreAdjustButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeScoreAdjustButtonText: {
    fontFamily: typography.family.heading,
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * 1.1,
  },
  challengeScoreButtonValue: {
    fontFamily: typography.family.display,
    fontSize: typography.size['4xl'],
    lineHeight: typography.size['4xl'] * 1.15,
    textAlignVertical: 'center',
    paddingTop: 3,
  },
  challengeVsWrap: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeVsText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.display,
    letterSpacing: 0.8,
  },
  challengeBeerSection: {
    gap: spacing[2],
    marginTop: spacing[1],
  },
  challengeBeerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  challengeBeerField: {
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
  challengeBeerLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  challengeBeerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  challengeBeerAdjustButton: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeBeerAdjustButtonText: {
    fontFamily: typography.family.heading,
    fontSize: typography.size.base,
    lineHeight: typography.size.base * 1.1,
  },
  challengeBeerValue: {
    fontFamily: typography.family.display,
    fontSize: typography.size.xl,
    minWidth: 28,
    textAlign: 'center',
  },
  confirmationTimeline: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[2],
  },
  confirmationTitle: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  confirmationLine: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
  opponentStatus: {
    alignItems: 'center',
    gap: spacing[1],
  },
  opponentStatusText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
  refreshingIndicator: {
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
});
