import { StyleSheet } from 'react-native';
import { typography, spacing } from '@/constants/theme';
import { scale, verticalScale } from '@/utils/scale';

export const styles = StyleSheet.create({
  stickyHeader: {},
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
    paddingBottom: verticalScale(160),
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
  tabRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingRight: spacing[4],
  },
  tabCreateBtn: {
    paddingBottom: spacing[2],
    marginLeft: spacing[2],
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
