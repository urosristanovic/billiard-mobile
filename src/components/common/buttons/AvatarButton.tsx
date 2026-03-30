import { TouchableOpacity, StyleSheet, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useTheme } from '@/hooks/useTheme';
import { radius, spacing } from '@/constants/theme';
import type { AppDrawerParamList } from '@/navigation/AppNavigator';

interface AvatarButtonProps {
  style?: ViewStyle;
}

export const AvatarButton = ({ style }: AvatarButtonProps) => {
  const navigation = useNavigation<DrawerNavigationProp<AppDrawerParamList>>();
  const { tk } = useTheme();

  return (
    <TouchableOpacity
      accessibilityRole='button'
      accessibilityLabel='Open menu'
      onPress={() => navigation.openDrawer()}
      style={[
        styles.button,
        {
          borderColor: tk.primary[700],
          backgroundColor: tk.surface.raised,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      <View style={[styles.bar, { backgroundColor: tk.primary[300] }]} />
      <View style={[styles.bar, styles.barMid, { backgroundColor: tk.primary[300] }]} />
      <View style={[styles.bar, { backgroundColor: tk.primary[300] }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  bar: {
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  barMid: {
    width: 12,
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
});
