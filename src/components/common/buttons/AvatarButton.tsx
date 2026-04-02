import { TouchableOpacity, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { radius, spacing } from '@/constants/theme';

interface AvatarButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
}

export const AvatarButton = ({ onPress, style }: AvatarButtonProps) => {
  const { tk } = useTheme();

  return (
    <TouchableOpacity
      accessibilityRole='button'
      accessibilityLabel='Open menu'
      onPress={onPress}
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
