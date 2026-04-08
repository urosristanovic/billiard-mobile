import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';
import { scale } from '@/utils/scale';

export const detailStyles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[2],
    gap: spacing[2],
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  listContentWithBottomAction: {
    paddingBottom: spacing[20],
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  meta: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing[4],
  },
  sectionTitle: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    gap: spacing[3],
  },
  memberAvatar: {
    width: scale(44),
    height: scale(44),
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
  },
  memberUsername: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    marginTop: 2,
  },
  footer: {
    marginTop: spacing[6],
    gap: spacing[3],
  },
  bottomActionBar: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[5],
    borderTopWidth: 1,
  },
});
