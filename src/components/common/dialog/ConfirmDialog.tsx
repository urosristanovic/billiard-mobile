import { Modal, StyleSheet, Text, View } from 'react-native';
import { radius, shadows, spacing, theme, typography } from '@/constants/theme';
import { DangerButton, PrimaryButton, SecondaryButton } from '../buttons';

export type ConfirmDialogVariant = 'default' | 'destructive';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: ConfirmDialogVariant;
  isDark?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'default',
  isDark = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
  const tk = isDark ? theme.dark : theme.light;
  const isDestructive = variant === 'destructive';

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View
        style={[styles.backdrop, { backgroundColor: tk.background.overlay }]}
      >
        <View
          style={[
            styles.dialog,
            {
              backgroundColor: tk.surface.default,
              borderColor: isDestructive ? tk.error.border : tk.primary[700],
            },
            shadows.lg,
          ]}
          accessibilityRole='alert'
          accessibilityLiveRegion='polite'
        >
          <Text style={[styles.title, { color: tk.text.primary }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: tk.text.secondary }]}>
            {message}
          </Text>
          <View style={styles.actions}>
            <SecondaryButton
              label={cancelLabel}
              onPress={onCancel}
              isDark={isDark}
              style={styles.action}
            />
            {isDestructive ? (
              <DangerButton
                label={confirmLabel}
                onPress={onConfirm}
                isDark={isDark}
                style={styles.action}
              />
            ) : (
              <PrimaryButton
                label={confirmLabel}
                onPress={onConfirm}
                isDark={isDark}
                style={styles.action}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  dialog: {
    borderRadius: radius.xl,
    borderWidth: 2,
    padding: spacing[6],
    gap: spacing[4],
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  message: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.normal,
    fontFamily: typography.family.body,
    lineHeight: Math.round(
      typography.size.base * typography.lineHeight.relaxed,
    ),
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  action: {
    flex: 1,
  },
});
