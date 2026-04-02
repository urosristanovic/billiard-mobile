import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  stickyHeader: {
    borderBottomWidth: 1,
  },
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
  statsContainer: {
    marginHorizontal: spacing[4],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    marginBottom: spacing[4],
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[1],
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  statLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  section: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing[2],
  },
  list: {
    padding: spacing[4],
    gap: spacing[3],
    paddingBottom: 160,
  },
  cardList: {
    gap: spacing[2],
  },
  emptyText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    textAlign: 'center',
    paddingVertical: spacing[2],
  },
  divider: {
    height: 1,
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  fabRow: {
    position: 'absolute',
    bottom: spacing[4],
    left: spacing[5],
    right: spacing[5],
    flexDirection: 'row',
    gap: spacing[3],
  },
});
