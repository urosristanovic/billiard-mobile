import { StyleSheet } from 'react-native';
import { typography, spacing, radius } from '@/constants/theme';
import { scale } from '@/utils/scale';

export const styles = StyleSheet.create({
  content: {
    minHeight: scale(460),
    gap: spacing[4],
  },
  sectionLabel: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing[2],
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  otherRow: {
    marginTop: spacing[6],
    borderWidth: 0.5,
    borderRadius: radius['3xl'],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[6],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  otherStepButton: {
    width: scale(48),
    height: scale(48),
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherValue: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  messageInput: {
    minHeight: scale(80),
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
});
