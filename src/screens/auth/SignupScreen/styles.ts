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
  confirmContainer: {
    flex: 1,
    padding: spacing[6],
    gap: spacing[5],
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
    gap: spacing[4],
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  checkbox: {
    width: scale(20),
    height: scale(20),
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  checkmark: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    lineHeight: typography.size.xs * 1.2,
  },
  termsTextWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    rowGap: 2,
  },
  termsText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    lineHeight: typography.size.xs * 1.5,
  },
  termsLink: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
    letterSpacing: 0.3,
    lineHeight: typography.size.xs * 1.5,
  },
  termsError: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    marginTop: spacing[1],
    marginLeft: scale(20) + spacing[3],
  },
});
