import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[3],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
    flex: 1,
  },

  profileCard: {
    marginBottom: spacing[4],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarInitial: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    letterSpacing: 1,
  },
  profileInfo: {
    flex: 1,
    gap: spacing[1],
  },
  displayName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  username: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing[2],
    gap: spacing[4],
  },
  statItem: {
    alignItems: 'flex-start',
    gap: 2,
  },
  statValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  statLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  sectionTitle: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.md,
    borderWidth: 1,
  },
  filterButtonLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterBadge: {
    width: 16,
    height: 16,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 9,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
  },

  list: {
    padding: spacing[4],
    gap: spacing[3],
    paddingBottom: 140,
  },
});
