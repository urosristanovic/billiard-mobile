import { TouchableOpacity, StyleSheet, Text, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/useAuth';
import { radius, typography } from '@/constants/theme';
import type { AppDrawerParamList } from '@/navigation/AppNavigator';

interface AvatarButtonProps {
  style?: ViewStyle;
}

export const AvatarButton = ({ style }: AvatarButtonProps) => {
  const navigation = useNavigation<DrawerNavigationProp<AppDrawerParamList>>();
  const { tk } = useTheme();
  const { user } = useAuth();

  const initials = (
    user?.displayName?.slice(0, 2) ||
    user?.username?.slice(0, 2) ||
    'U'
  ).toUpperCase();

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
      <Text style={[styles.text, { color: tk.primary[300] }]}>{initials}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
