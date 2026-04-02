import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/theme';
import { AppLogo } from '../AppLogo';

export const AppHeader = () => {
  const { tk } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tk.background.primary,
          borderBottomColor: tk.border.subtle,
        },
      ]}
    >
      <AppLogo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
  },
});
