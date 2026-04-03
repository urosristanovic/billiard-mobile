import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import { SecondaryButton } from '@/components/common/buttons/SecondaryButton';
import { Loading } from '@/components/common/states';
import { styles } from '../styles';

interface Props {
  isIncoming: boolean;
  isSubmitting: boolean;
  onAccept: () => void;
  onDecline: (reason?: string) => void;
  onCancel: () => void;
}

export const InvitationActions = ({
  isIncoming,
  isSubmitting,
  onAccept,
  onDecline,
  onCancel,
}: Props) => {
  const { t } = useTranslation('tournaments');
  const { isDark } = useTheme();

  return (
    <View style={styles.actionsRow}>
      {isSubmitting ? (
        <Loading style={styles.loader} />
      ) : isIncoming ? (
        <>
          <SecondaryButton
            label={t('invitation.rejectButton')}
            onPress={() => onDecline()}
            isDark={isDark}
            style={{ flex: 1 }}
          />
          <PrimaryButton
            label={t('invitation.acceptButton')}
            onPress={onAccept}
            isDark={isDark}
            style={{ flex: 1 }}
          />
        </>
      ) : (
        <SecondaryButton
          label={t('invitation.cancelButton')}
          onPress={onCancel}
          isDark={isDark}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
};
