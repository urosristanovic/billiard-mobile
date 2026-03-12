import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { spacing, radius, shadows, theme, typography } from '@/constants/theme';

export type ToastType = 'error' | 'success' | 'warning' | 'info';

interface ToastProps {
  title: string;
  message?: string;
  type: ToastType;
  isDark?: boolean;
  topOffset: number;
  translateY: Animated.Value;
  onClose: () => void;
  closeLabel: string;
}

export const Toast = ({
  title,
  message,
  type,
  isDark = false,
  topOffset,
  translateY,
  onClose,
  closeLabel,
}: ToastProps) => {
  const tk = isDark ? theme.dark : theme.light;
  const accentColor = getAccentColor(type, tk);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: topOffset,
          backgroundColor: tk.surface.raised,
          borderColor: tk.border.default,
          transform: [{ translateY }],
        },
        shadows.md,
      ]}
      accessibilityRole='alert'
      accessibilityLiveRegion='polite'
    >
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <Text
          style={[styles.title, { color: tk.text.primary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {message ? (
          <Text
            style={[styles.message, { color: tk.text.secondary }]}
            numberOfLines={1}
          >
            {message}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeButton}
        accessibilityRole='button'
        accessibilityLabel={closeLabel}
      >
        <Text style={[styles.closeText, { color: tk.text.muted }]}>X</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const getAccentColor = (
  type: ToastType,
  tk: typeof theme.light | typeof theme.dark,
) => {
  switch (type) {
    case 'error':
      return tk.error.text;
    case 'success':
      return tk.primary[500];
    case 'warning':
      return tk.warning.default;
    case 'info':
    default:
      return tk.info.default;
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing[4],
    right: spacing[4],
    minHeight: 64,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 1000,
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[1],
  },
  title: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.bodySemibold,
  },
  message: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.normal,
    fontFamily: typography.family.body,
  },
  closeButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[1],
  },
  closeText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
  },
});
