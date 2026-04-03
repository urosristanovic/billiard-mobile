import { useRef, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius } from '@/constants/theme';

interface FloatingActionButtonProps {
  label: string;
  icon?: ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary';
}

export const FloatingActionButton = ({
  label,
  icon,
  onPress,
  style,
  variant = 'primary',
}: FloatingActionButtonProps) => {
  const { tk } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const animateIn = () =>
    Animated.spring(scale, {
      toValue: 0.93,
      useNativeDriver: true,
    }).start();

  const animateOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

  const isPrimary = variant === 'primary';

  return (
    <Animated.View
      style={[
        styles.fab,
        isPrimary
          ? { transform: [{ scale }], shadowColor: tk.primary[600] }
          : {
              transform: [{ scale }],
              backgroundColor: tk.surface.default,
              borderWidth: 1,
              borderColor: tk.border.default,
              shadowColor: tk.surface.default,
            },
        style,
      ]}
    >
      {isPrimary && (
        <View style={[StyleSheet.absoluteFill, styles.gradientClip]}>
          <LinearGradient
            colors={[tk.primary[700], tk.primary[600]]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}

      <Pressable
        onPress={onPress}
        onPressIn={animateIn}
        onPressOut={animateOut}
        accessibilityRole='button'
        accessibilityLabel={label}
      >
        <View style={styles.inner}>
          {icon}
          <Text
            style={[
              styles.label,
              { color: isPrimary ? tk.text.onPrimary : tk.text.primary },
            ]}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fab: {
    borderRadius: radius.full,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  gradientClip: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  label: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.tight,
  },
});
