import { StyleSheet } from 'react-native';
import { radius, spacing, typography } from '@/constants/theme';
import { scale, moderateScale } from '@/utils/scale';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing[6],
    gap: spacing[8],
    justifyContent: 'center',
  },
  header: {
    gap: spacing[3],
  },
  title: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
  },
  divider: {
    width: scale(72),
    height: 2,
  },
  form: {
    gap: spacing[5],
  },
  typeLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: typography.family.bodySemibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[2],
  },
  typeOptions: {
    gap: spacing[2],
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  typeRadio: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeRadioInner: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  typeOptionText: {
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
  },
  messageInput: {
    minHeight: scale(120),
    textAlignVertical: 'top',
    paddingTop: spacing[3],
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  button: {
    flex: 1,
  },
});
