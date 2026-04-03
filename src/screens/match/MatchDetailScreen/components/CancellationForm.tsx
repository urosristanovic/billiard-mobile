import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/common/forms/FormField';
import { DangerButton, SecondaryButton } from '@/components/common/buttons';
import { theme, typography, spacing, radius } from '@/constants/theme';

interface CancellationFormProps {
  isVisible: boolean;
  reason: string;
  isSubmitting: boolean;
  isDark: boolean;
  title?: string;
  submitLabel?: string;
  placeholder?: string;
  onReasonChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const CancellationForm = ({
  isVisible,
  reason,
  isSubmitting,
  isDark,
  title,
  submitLabel,
  placeholder,
  onReasonChange,
  onSubmit,
  onCancel,
}: CancellationFormProps) => {
  const { t } = useTranslation('matches');
  const { t: tCommon } = useTranslation('common');
  const tk = isDark ? theme.dark : theme.light;

  if (!isVisible) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: tk.surface.raised, borderColor: tk.error.border },
      ]}
    >
      <Text style={[styles.title, { color: tk.error.text }]}>
        {title ?? t('detail.cancelWithReasonButton')}
      </Text>

      <FormField
        label={t('detail.disputeReasonLabel')}
        value={reason}
        onChangeText={onReasonChange}
        placeholder={placeholder ?? t('detail.cancellationReasonPlaceholder')}
        isDark={isDark}
      />

      <View style={styles.actions}>
        <DangerButton
          label={submitLabel ?? tCommon('submit')}
          onPress={onSubmit}
          loading={isSubmitting}
          isDark={isDark}
          style={{ flex: 1 }}
        />
        <SecondaryButton
          label={tCommon('close')}
          onPress={onCancel}
          isDark={isDark}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius['3xl'],
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  title: {
    fontSize: typography.size.base,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: {
    gap: spacing[2],
    flexDirection: 'row',
  },
});
