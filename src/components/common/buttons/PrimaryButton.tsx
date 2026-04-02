import { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  theme,
  typography,
  radius,
  spacing,
  minTouchTarget,
} from '@/constants/theme';

interface PrimaryButtonProps {
  label: string;
  loading?: boolean;
  compact?: boolean;
  size?: 'xs';
  isDark?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const PrimaryButton = ({
  label,
  loading,
  compact,
  size,
  isDark = false,
  disabled,
  onPress,
  style,
  accessibilityLabel,
}: PrimaryButtonProps) => {
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
          shadowColor: t.primary[600],
          opacity: disabled || loading ? 0.5 : 1,
        },
        style,
      ]}
    >
      <View style={[StyleSheet.absoluteFill, styles.gradientClip]}>
        <LinearGradient
          colors={[t.primary[700], t.primary[500]]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <Pressable
        onPress={onPress}
        onPressIn={animateIn}
        onPressOut={animateOut}
        disabled={disabled || loading}
        accessibilityRole='button'
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: disabled || loading }}
        style={isXs ? styles.innerXs : compact ? styles.innerCompact : styles.inner}
      >
        {loading ? (
          <ActivityIndicator
            size='small'
            color={t.text.onPrimary}
            accessibilityLabel='Loading'
          />
        ) : (
          <Text
            style={[
              styles.label,
              isXs && styles.labelXs,
              { color: t.text.onPrimary },
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
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    minHeight: minTouchTarget,
    justifyContent: 'center',
  },
  gradientClip: {
    borderRadius: radius['2xl'],
    overflow: 'hidden',
  },
  regular: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
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
