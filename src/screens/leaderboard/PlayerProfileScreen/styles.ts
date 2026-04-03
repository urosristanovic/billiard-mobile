import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing[20],
  },
  hero: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[3],
    padding: spacing[5],
    borderRadius: radius['3xl'],
    borderWidth: 1,
    alignItems: 'center',
    gap: spacing[2],
    overflow: 'hidden',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  avatarInitial: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  displayName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textAlign: 'center',
  },
  username: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  location: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  bio: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    textAlign: 'center',
    marginTop: spacing[1],
  },
  section: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
    gap: spacing[2],
  },
  sectionHeader: {
    gap: 2,
    marginBottom: spacing[1],
  },
  sectionTitle: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: radius['3xl'],
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  statValue: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  statLabel: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 0.5,
    marginVertical: spacing[3],
  },
  ratingCard: {
    padding: spacing[4],
    borderRadius: radius['3xl'],
    borderWidth: 0.5,
    gap: spacing[1],
  },
  ratingDiscipline: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  ratingValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  ratingNumber: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  ratingRD: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
  provisionalBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  provisionalText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingWL: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  fab: {
    position: 'absolute',
    bottom: spacing[6],
    left: spacing[5],
    right: spacing[5],
  },
});
