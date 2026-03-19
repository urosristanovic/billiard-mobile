import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/constants/theme';

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
    width: 72,
    height: 2,
  },
  form: {
    gap: spacing[4],
  },
  successBox: {
    borderWidth: 1,
    borderRadius: spacing[3],
    padding: spacing[4],
    gap: spacing[2],
  },
  successTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  successText: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * 1.5,
    fontFamily: typography.family.body,
  },
});
