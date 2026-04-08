import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';
import { scale } from '@/utils/scale';

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
    flexDirection: 'row',
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
  challengeScoreLabelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  challengeScoreLabel: {
    flex: 1,
    fontSize: typography.size.lg,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  challengeScoreLabelLeft: {},
  challengeScoreLabelRight: {
    textAlign: 'right',
  },
  challengeVsLabelSpacer: {
    width: spacing[6],
  },
  challengeScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  challengeScoreField: {
    flex: 1,
  },
  challengeScoreBlock: {
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    alignItems: 'center',
    gap: spacing[2],
  },
  challengeScoreValue: {
    fontFamily: typography.family.display,
    fontSize: typography.size['5xl'],
    lineHeight: typography.size['5xl'] * 1.15,
    textAlignVertical: 'center',
    paddingTop: spacing[1],
  },
  challengeAdjRow: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  challengeAdjBtn: {
    width: spacing[12],
    height: spacing[12],
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeVsWrap: {
    width: scale(28),
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
    width: scale(28),
    height: scale(28),
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
    minWidth: scale(28),
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
