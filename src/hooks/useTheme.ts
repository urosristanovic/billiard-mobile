import { useColorScheme } from 'react-native';
import { theme } from '@/constants/theme';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  return { isDark, tk: isDark ? theme.dark : theme.light };
};
