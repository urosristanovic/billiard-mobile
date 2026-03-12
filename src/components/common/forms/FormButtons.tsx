import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/theme';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';

interface FormButtonsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitDisabled?: boolean;
  submitLoading?: boolean;
  isDark?: boolean;
}

export const FormButtons = ({
  submitLabel = '',
  cancelLabel = '',
  onSubmit,
  onCancel,
  submitDisabled,
  submitLoading,
  isDark = false,
}: FormButtonsProps) => (
  <View style={styles.container}>
    <PrimaryButton
      label={submitLabel}
      onPress={onSubmit}
      disabled={submitDisabled}
      loading={submitLoading}
      isDark={isDark}
      style={styles.submit}
    />
    {onCancel && (
      <SecondaryButton
        label={cancelLabel}
        onPress={onCancel}
        isDark={isDark}
        style={styles.cancel}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  submit: {
    flex: 1,
  },
  cancel: {
    flex: 1,
  },
});
