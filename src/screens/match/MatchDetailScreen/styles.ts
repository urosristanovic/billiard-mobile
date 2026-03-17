import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    gap: spacing[4],
    paddingBottom: spacing[8],
  },
  discipline: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  challengeScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  challengeScoreLabel: {
    flex: 1,
    fontSize: typography.size.base,
    fontFamily: typography.family.bodySemibold,
  },
  challengeScoreControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  challengeScoreValue: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: typography.size.xl,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
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
});
