import { StyleSheet } from 'react-native';
import { typography, spacing } from '@/constants/theme';
import { scale } from '@/utils/scale';

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
    color: '#D4D4D4',
  },
  divider: {
    width: scale(72),
    height: 2,
  },
  form: {
    gap: spacing[4],
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  footerText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    lineHeight: typography.size.sm * 1.4,
  },
  footerLink: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: typography.size.sm * 1.4,
    marginLeft: spacing[1],
  },
});
