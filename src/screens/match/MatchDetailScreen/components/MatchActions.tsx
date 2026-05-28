import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  DangerButton,
  PrimaryButton,
  SecondaryButton,
} from '@/components/common/buttons';
import type { Match, MatchPlayer } from '@/types/match';
import { styles } from '../styles';

interface MatchActionsProps {
  match: Match;
  me: MatchPlayer | null;
  opponent: MatchPlayer | null;
  isDark: boolean;
  isConfirming: boolean;
  isDisputing: boolean;
  isCancelling: boolean;
  onConfirm: () => void;
  onOpenDispute: () => void;
  onOpenCancel: () => void;
  onAcceptCancel: () => void;
}

export const MatchActions = ({
  match,
  me,
  opponent,
  isDark,
  isConfirming,
  isDisputing,
  isCancelling,
  onConfirm,
  onOpenDispute,
  onOpenCancel,
  onAcceptCancel,
}: MatchActionsProps) => {
  const { t } = useTranslation('matches');
  const isPending = match.status === 'pending_confirmation';
  if (!isPending || !me) return null;

  const opponentRequestedCancel = !!opponent?.cancelRequested;
  const iNeedToConfirm = !me.confirmed;

  const canOpenDispute = match.isTournament
    ? iNeedToConfirm
    : !me.cancelRequested && (!me.confirmed || opponentRequestedCancel);
  const canOpenCancel =
    !match.isTournament && !me.cancelRequested && !opponentRequestedCancel;
  const canAcceptCancel =
    !match.isTournament && !me.cancelRequested && opponentRequestedCancel;
  const canAcceptResult =
    iNeedToConfirm && !opponentRequestedCancel && !me.cancelRequested;

  return (
    <View style={styles.actions}>
      {canAcceptResult && (
        <PrimaryButton
          label={t('detail.acceptResultButton')}
          onPress={onConfirm}
          loading={isConfirming}
          isDark={isDark}
          style={{ flex: 1 }}
        />
      )}

      {canOpenDispute && (
        <DangerButton
          label={t('detail.disputeButton')}
          onPress={onOpenDispute}
          loading={isDisputing}
          isDark={isDark}
          style={{ flex: 1 }}
        />
      )}

      {!match.isTournament && (
        <SecondaryButton
          label={
            me.cancelRequested
              ? t('detail.cancelAlreadyRequestedButton')
              : canAcceptCancel
                ? t('detail.acceptCancellationButton')
                : t('detail.cancelWithReasonButton')
          }
          onPress={canAcceptCancel ? onAcceptCancel : onOpenCancel}
          loading={isCancelling}
          disabled={!canOpenCancel && !canAcceptCancel}
          isDark={isDark}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
};
