import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/constants/theme';
import { scale } from '@/utils/scale';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing[6],
    gap: spacing[8],
    justifyContent: 'center',
  },
  subtitle: {
    gap: spacing[3],
  },
  subtitleText: {
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
});
