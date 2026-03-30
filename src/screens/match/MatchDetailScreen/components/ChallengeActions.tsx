import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  DangerButton,
  PrimaryButton,
  SecondaryButton,
} from '@/components/common/buttons';
import { useTheme } from '@/hooks/useTheme';
import type { Match } from '@/types/match';
import { styles } from '../styles';

interface ChallengeActionsProps {
  match: Match;
  myUserId: string;
  isAccepting: boolean;
  isDeclining: boolean;
  isCancelling: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onCancelRequest: () => void;
}

export const ChallengeActions = ({
  match,
  myUserId,
  isAccepting,
  isDeclining,
  isCancelling,
  onAccept,
  onDecline,
  onCancelRequest,
}: ChallengeActionsProps) => {
  const { t } = useTranslation('matches');
  const { isDark } = useTheme();

  const isCreator = match.createdBy === myUserId;

  return (
    <View style={styles.actions}>
      {isCreator ? (
        <SecondaryButton
          label={t('detail.cancelChallengeRequestButton')}
          onPress={onCancelRequest}
          loading={isCancelling}
          isDark={isDark}
        />
      ) : (
        <>
          <PrimaryButton
            label={t('detail.acceptChallengeButton')}
            onPress={onAccept}
            loading={isAccepting}
            isDark={isDark}
          />
          <DangerButton
            label={t('detail.declineChallengeButton')}
            onPress={onDecline}
            loading={isDeclining}
            isDark={isDark}
          />
        </>
      )}
    </View>
  );
};
