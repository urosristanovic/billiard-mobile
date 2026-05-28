import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/constants/theme';

export function useSafeBottom(minSpacing = spacing[4]) {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, minSpacing);
}
