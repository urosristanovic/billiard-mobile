import { type ReactNode, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import {
  theme,
  typography,
  radius,
  spacing,
  minTouchTarget,
} from '@/constants/theme';

interface GhostButtonProps {
  label: string;
  size?: 'sm' | 'lg';
  icon?: ReactNode;
  badge?: number;
  active?: boolean;
  isDark?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const GhostButton = ({
  label,
  size = 'sm',
  icon,
  badge,
  active = false,
  isDark = false,
  disabled,
  onPress,
  style,
  accessibilityLabel,
}: GhostButtonProps) => {
  const t = isDark ? theme.dark : theme.light;
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

  const isLg = size === 'lg';

  return (
    <Animated.View
      style={[
        styles.base,
        isLg ? styles.sizeLg : styles.sizeSm,
        {
          transform: [{ scale }],
          borderColor: active ? t.primary[600] : t.border.default,
          backgroundColor: active ? t.primary[900] : 'transparent',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={animateIn}
        onPressOut={animateOut}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        style={isLg ? styles.innerLg : styles.innerSm}
      >
        <Text
          style={[
            styles.label,
            isLg ? styles.labelLg : styles.labelSm,
            { color: active ? t.primary[500] : t.primary[600] },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {icon}
        {badge != null && badge > 0 && (
          <View style={[styles.badge, { backgroundColor: t.primary[500] }]}>
            <Text style={[styles.badgeText, { color: t.background.primary }]}>
              {badge}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius['2xl'],
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[1],
  },
  sizeSm: {
    minHeight: 32,
  },
  sizeLg: {
    minHeight: minTouchTarget,
  },
  innerSm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  innerLg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  label: {
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.tight,
    textAlign: 'center',
  },
  labelSm: {
    fontSize: typography.size.sm,
  },
  labelLg: {
    fontSize: typography.size.base,
  },
  badge: {
    width: 16,
    height: 16,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
  },
});
