import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import {
  theme,
  typography,
  radius,
  spacing,
  minTouchTarget,
} from '@/constants/theme';

interface DangerButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  compact?: boolean;
  isDark?: boolean;
}

export const DangerButton = ({
  label,
  loading,
  compact,
  isDark = false,
  disabled,
  style,
  ...props
}: DangerButtonProps) => {
  const t = isDark ? theme.dark : theme.light;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      accessibilityRole='button'
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading }}
      style={[
        styles.base,
        compact ? styles.compact : styles.regular,
        {
          backgroundColor: t.surface.raised,
          borderColor: t.error.border,
        },
        (disabled || loading) && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size='small' color={t.error.text} />
      ) : (
        <Text style={[styles.label, { color: t.error.text }]} numberOfLines={1}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: minTouchTarget,
  },
  regular: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  compact: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    minHeight: 36,
  },
  label: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
