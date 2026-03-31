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
  cancelFirst?: boolean;
}

export const FormButtons = ({
  submitLabel = '',
  cancelLabel = '',
  onSubmit,
  onCancel,
  submitDisabled,
  submitLoading,
  isDark = false,
  cancelFirst = false,
}: FormButtonsProps) => {
  const submitButton = (
    <PrimaryButton
      label={submitLabel}
      onPress={onSubmit}
      disabled={submitDisabled}
      loading={submitLoading}
      isDark={isDark}
      style={styles.submit}
    />
  );

  const cancelButton = onCancel ? (
    <SecondaryButton
      label={cancelLabel}
      onPress={onCancel}
      isDark={isDark}
      style={styles.cancel}
    />
  ) : null;

  return (
    <View style={styles.container}>
      {cancelFirst ? (
        <>
          {cancelButton}
          {submitButton}
        </>
      ) : (
        <>
          {submitButton}
          {cancelButton}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginVertical: spacing[2],
    paddingHorizontal: spacing[4],
  },
  submit: {
    flex: 1,
  },
  cancel: {
    flex: 1,
  },
});
