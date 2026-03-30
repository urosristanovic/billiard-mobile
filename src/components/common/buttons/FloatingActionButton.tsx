import { StyleSheet, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius } from '@/constants/theme';

interface FloatingActionButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const FloatingActionButton = ({
  label,
  onPress,
  style,
}: FloatingActionButtonProps) => {
  const { tk } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole='button'
      accessibilityLabel={label}
      style={[
        styles.fab,
        {
          backgroundColor: tk.primary[500],
          borderColor: tk.primary[700],
          shadowColor: '#000',
        },
        style,
      ]}
    >
      <View style={styles.inner}>
        <Text style={[styles.label, { color: tk.background.primary }]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing[4],
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  label: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
