import { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';
import {
  theme,
  typography,
  radius,
  spacing,
  minTouchTarget,
} from '@/constants/theme';

interface DangerButtonProps {
  label: string;
  loading?: boolean;
  compact?: boolean;
  size?: 'xs';
  isDark?: boolean;
  disabled?: boolean;
  noShadow?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const DangerButton = ({
  label,
  loading,
  compact,
  size,
  isDark = false,
  disabled,
  noShadow,
  onPress,
  style,
  accessibilityLabel,
}: DangerButtonProps) => {
  const t = isDark ? theme.dark : theme.light;
  const scale = useRef(new Animated.Value(1)).current;
  const isXs = size === 'xs';

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

  return (
    <Animated.View
      style={[
        styles.base,
        isXs ? styles.sizeXs : compact ? styles.compact : styles.regular,
        {
          transform: [{ scale }],
          backgroundColor: t.surface.raised,
          borderColor: t.error.border,
          shadowColor: isXs || noShadow ? 'transparent' : t.error.border,
          elevation: isXs || noShadow ? 0 : undefined,
          shadowOpacity: noShadow ? 0 : undefined,
          opacity: disabled || loading ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={animateIn}
        onPressOut={animateOut}
        disabled={disabled || loading}
        accessibilityRole='button'
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: disabled || loading }}
        style={
          isXs ? styles.innerXs : compact ? styles.innerCompact : styles.inner
        }
      >
        {loading ? (
          <ActivityIndicator size='small' color={t.primary[400]} />
        ) : (
          <Text
            style={[
              styles.label,
              isXs && styles.labelXs,
              { color: t.error.text },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius['2xl'],
    borderWidth: 1,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    minHeight: minTouchTarget,
    justifyContent: 'center',
  },
  regular: {},
  compact: {
    minHeight: 36,
  },
  sizeXs: {
    minHeight: 32,
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[1],
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  innerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  innerXs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  label: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.tight,
    textAlign: 'center',
  },
  labelXs: {
    fontSize: typography.size.xs,
  },
});
