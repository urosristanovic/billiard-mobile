import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/common/forms/FormField';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { theme, typography, spacing, radius } from '@/constants/theme';

interface DisputeFormProps {
  isVisible: boolean;
  title?: string;
  submitLabel?: string;
  reason: string;
  myScore: string;
  opponentScore: string;
  opponentName: string;
  validationError: string | null;
  isSubmitting: boolean;
  isDark: boolean;
  onReasonChange: (value: string) => void;
  onMyScoreChange: (value: string) => void;
  onOpponentScoreChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const DisputeForm = ({
  isVisible,
  title,
  submitLabel,
  reason,
  myScore,
  opponentScore,
  opponentName,
  validationError,
  isSubmitting,
  isDark,
  onReasonChange,
  onMyScoreChange,
  onOpponentScoreChange,
  onSubmit,
  onCancel,
}: DisputeFormProps) => {
  const { t } = useTranslation('matches');
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
        {title ?? t('detail.disputeFormTitle')}
      </Text>

      <FormField
        label={t('detail.disputeReasonLabel')}
        value={reason}
        onChangeText={onReasonChange}
        placeholder={t('detail.disputeReasonPlaceholder')}
        isDark={isDark}
      />

      <FormField
        label={t('detail.disputeYourScore')}
        value={myScore}
        onChangeText={onMyScoreChange}
        keyboardType='numeric'
        isDark={isDark}
      />

      <FormField
        label={t('detail.disputeOpponentScore', { name: opponentName })}
        value={opponentScore}
        onChangeText={onOpponentScoreChange}
        keyboardType='numeric'
        isDark={isDark}
      />

      {validationError ? (
        <Text style={[styles.error, { color: tk.error.text }]}>
          {validationError}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <SecondaryButton
          label={t('detail.closeDisputeFormButton')}
          onPress={onCancel}
          isDark={isDark}
          style={{ flex: 1 }}
        />
        <PrimaryButton
          label={submitLabel ?? t('detail.submitDisputeButton')}
          onPress={onSubmit}
          loading={isSubmitting}
          isDark={isDark}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
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
  error: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bodyMedium,
  },
  actions: {
    gap: spacing[2],
    flexDirection: 'row',
  },
});
