import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';
import { scale } from '@/utils/scale';

export const styles = StyleSheet.create({
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing[2],
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: scale(48),
  },
  triggerText: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
    flex: 1,
  },
  triggerChevron: {
    fontSize: typography.size.base,
    marginLeft: spacing[2],
  },
  errorText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    color: '#ef4444',
    marginTop: spacing[1],
  },
  searchContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    gap: spacing[3],
  },
  sheetTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    letterSpacing: 1,
    marginTop: spacing[1],
  },
  search: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: typography.size.base,
    minHeight: scale(44),
  },
  listContent: {
    paddingBottom: spacing[8],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    minHeight: scale(52),
    gap: spacing[2],
  },
  optionText: {
    flex: 1,
    fontSize: typography.size.base,
  },
  optionCode: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
  checkmark: {
    fontSize: typography.size.base,
  },
});
