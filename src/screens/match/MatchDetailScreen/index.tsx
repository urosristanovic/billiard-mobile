import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMatchDetail } from '@/features/matches/useMatchDetail';
import { useMatchMutations } from '@/features/matches/useMatchMutations';
import { useAuth } from '@/features/auth/useAuth';
import { useConfirmDialog } from '@/components/common/dialog';
import { ScreenLayout } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import {
  DangerButton,
  PrimaryButton,
  SecondaryButton,
} from '@/components/common/buttons';
import { useTheme } from '@/hooks/useTheme';
import { DISCIPLINE_LABELS } from '@/types/match';
import {
  ScoreBoard,
  ConfirmationBanner,
  DisputeForm,
  DisputeResolution,
  DisputeHistory,
} from './components';
import { styles } from './styles';
import type { MatchesStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<MatchesStackParamList, 'MatchDetail'>;

const MatchDetailScreen = ({ route, navigation }: Props) => {
  const { matchId } = route.params;
  const { t } = useTranslation('matches');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { confirm } = useConfirmDialog();
  const { user } = useAuth();
  const [isDisputeFormVisible, setIsDisputeFormVisible] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [proposedMyScore, setProposedMyScore] = useState('');
  const [proposedOpponentScore, setProposedOpponentScore] = useState('');
  const [disputeValidationError, setDisputeValidationError] = useState<
    string | null
  >(null);

  const { data: match, isLoading, error } = useMatchDetail(matchId);
  const { confirmMatch, disputeMatch, cancelMatch, acceptDispute } =
    useMatchMutations();

  if (isLoading) {
    return (
      <ScreenLayout isDark={isDark}>
        <LoadingState message={t('loadingMatch')} isDark={isDark} />
      </ScreenLayout>
    );
  }
  if (error || !match) {
    return (
      <ScreenLayout isDark={isDark}>
        <EmptyState title={t('matchNotFound')} isDark={isDark} />
      </ScreenLayout>
    );
  }

  const me = match.players.find(p => p.userId === user?.id);
  const opponent = match.players.find(p => p.userId !== user?.id);
  const isPending = match.status === 'pending_confirmation';
  const isConfirmed = match.status === 'confirmed';
  const isDisputed = match.status === 'disputed';
  const iNeedToConfirm = isPending && me && !me.confirmed;
  const canRequestCancel =
    (isPending || isDisputed) && !!me && !me.cancelRequested;
  const opponentRequestedCancel = !!opponent?.cancelRequested;
  const openDispute = match.dispute?.status === 'open' ? match.dispute : null;
  const iAmDisputer = openDispute?.disputedBy === user?.id;
  const canResolveDispute = isDisputed && !!openDispute && !iAmDisputer;
  const myConfirmedAt = me?.confirmedAt ?? null;
  const opponentConfirmedAt = opponent?.confirmedAt ?? null;
  const rawOpenDisputeMyScore = me
    ? openDispute?.proposedScores[me.userId]
    : undefined;
  const rawOpenDisputeOpponentScore = opponent
    ? openDispute?.proposedScores[opponent.userId]
    : undefined;
  const openDisputeMyScore =
    typeof rawOpenDisputeMyScore === 'number' ? rawOpenDisputeMyScore : null;
  const openDisputeOpponentScore =
    typeof rawOpenDisputeOpponentScore === 'number'
      ? rawOpenDisputeOpponentScore
      : null;

  const statusColor: Record<string, string> = {
    pending_confirmation: tk.warning.default,
    confirmed: tk.success.default,
    disputed: tk.error.default,
    cancelled: tk.text.muted,
  };
  const statusBg: Record<string, string> = {
    pending_confirmation: tk.warning.light,
    confirmed: tk.success.light,
    disputed: tk.error.light,
    cancelled: tk.surface.overlay,
  };

  const handleConfirm = () =>
    confirm({
      title: t('detail.confirmTitle'),
      message: t('detail.confirmMessage'),
      cancelLabel: tCommon('cancel'),
      confirmLabel: t('detail.confirmShortButton'),
      onConfirm: () =>
        confirmMatch.mutate(match.id, {
          onSuccess: () => navigation.goBack(),
        }),
    });

  const handleDispute = () => {
    setProposedMyScore(me?.score?.toString() ?? '');
    setProposedOpponentScore(opponent?.score?.toString() ?? '');
    setDisputeValidationError(null);
    setIsDisputeFormVisible(true);
  };

  const handleCancelRequest = () =>
    confirm({
      title: t('detail.cancelTitle'),
      message: t('detail.cancelMessage'),
      cancelLabel: tCommon('cancel'),
      confirmLabel: t('detail.requestShortButton'),
      variant: 'destructive',
      onConfirm: () => cancelMatch.mutate(match.id),
    });

  const handleAcceptCancel = () =>
    confirm({
      title: t('detail.acceptCancelTitle'),
      message: t('detail.acceptCancelMessage'),
      cancelLabel: tCommon('cancel'),
      confirmLabel: t('detail.acceptCorrectionShortButton'),
      variant: 'destructive',
      onConfirm: () => cancelMatch.mutate(match.id),
    });

  const handleSubmitDispute = () => {
    if (!me || !opponent) return;

    const myScore = Number(proposedMyScore);
    const oppScore = Number(proposedOpponentScore);

    if (!Number.isFinite(myScore) || !Number.isFinite(oppScore)) {
      setDisputeValidationError(t('create.scoreMustBeNumber'));
      return;
    }
    if (myScore < 0 || oppScore < 0) {
      setDisputeValidationError(t('detail.scoresMustBePositive'));
      return;
    }
    if (myScore === oppScore) {
      setDisputeValidationError(t('create.scoresMustDiffer'));
      return;
    }

    setDisputeValidationError(null);
    disputeMatch.mutate(
      {
        matchId: match.id,
        input: {
          reason: disputeReason.trim() || undefined,
          proposedScores: {
            [me.userId]: myScore,
            [opponent.userId]: oppScore,
          },
        },
      },
      {
        onSuccess: () => {
          setIsDisputeFormVisible(false);
          setDisputeReason('');
        },
      },
    );
  };

  const handleAcceptDispute = () =>
    confirm({
      title: t('detail.acceptCorrectionTitle'),
      message: t('detail.acceptCorrectionMessage'),
      cancelLabel: tCommon('cancel'),
      confirmLabel: t('detail.acceptCorrectionShortButton'),
      onConfirm: () => acceptDispute.mutate(match.id),
    });

  return (
    <ScreenLayout isDark={isDark}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.discipline, { color: tk.text.primary }]}>
          {DISCIPLINE_LABELS[match.discipline]}
        </Text>

        <View style={styles.metaRow}>
          <View
            style={[styles.badge, { backgroundColor: statusBg[match.status] }]}
          >
            <Text
              style={[styles.badgeText, { color: statusColor[match.status] }]}
            >
              {t(`status.${match.status}`)}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: match.isRated
                  ? tk.info.light
                  : tk.surface.overlay,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: match.isRated ? tk.info.default : tk.text.muted },
              ]}
            >
              {match.isRated ? t('detail.rated') : t('detail.unrated')}
            </Text>
          </View>
        </View>

        <Text style={[styles.date, { color: tk.text.muted }]}>
          {t('detail.playedAt')}:{' '}
          {new Date(match.playedAt).toLocaleDateString()}
        </Text>

        <ScoreBoard match={match} myUserId={user?.id ?? ''} isDark={isDark} />

        {isPending && (
          <ConfirmationBanner
            iConfirmed={!!me?.confirmed}
            autoConfirmAt={match.autoConfirmAt}
            isDark={isDark}
          />
        )}

        <DisputeForm
          isVisible={isDisputeFormVisible}
          reason={disputeReason}
          myScore={proposedMyScore}
          opponentScore={proposedOpponentScore}
          opponentName={opponent?.profile.displayName ?? t('detail.opponent')}
          validationError={disputeValidationError}
          isSubmitting={disputeMatch.isPending}
          isDark={isDark}
          onReasonChange={setDisputeReason}
          onMyScoreChange={setProposedMyScore}
          onOpponentScoreChange={setProposedOpponentScore}
          onSubmit={handleSubmitDispute}
          onCancel={() => setIsDisputeFormVisible(false)}
        />

        {isDisputed && me && opponent && openDispute && (
          <DisputeResolution
            reason={openDispute.reason}
            proposedMyScore={openDisputeMyScore}
            proposedOpponentScore={openDisputeOpponentScore}
            currentMyScore={me.score}
            currentOpponentScore={opponent.score}
            opponentName={opponent.profile.displayName}
            canResolve={canResolveDispute}
            isAccepting={acceptDispute.isPending}
            isDark={isDark}
            onAccept={handleAcceptDispute}
          />
        )}

        {isConfirmed && me && opponent && (
          <View
            style={[
              styles.confirmationTimeline,
              {
                backgroundColor: tk.surface.raised,
                borderColor: tk.border.default,
              },
            ]}
          >
            <Text
              style={[styles.confirmationTitle, { color: tk.text.primary }]}
            >
              {t('detail.confirmationTimeline')}
            </Text>
            <Text
              style={[styles.confirmationLine, { color: tk.text.secondary }]}
            >
              {t('detail.youConfirmedAt', {
                dateTime: myConfirmedAt
                  ? new Date(myConfirmedAt).toLocaleString()
                  : t('detail.confirmationTimeUnavailable'),
              })}
            </Text>
            <Text
              style={[styles.confirmationLine, { color: tk.text.secondary }]}
            >
              {t('detail.opponentConfirmedAt', {
                name: opponent.profile.displayName,
                dateTime: opponentConfirmedAt
                  ? new Date(opponentConfirmedAt).toLocaleString()
                  : t('detail.confirmationTimeUnavailable'),
              })}
            </Text>
          </View>
        )}

        {isConfirmed && match.disputes.length > 0 && (
          <DisputeHistory
            disputes={match.disputes}
            players={match.players}
            myUserId={user?.id ?? ''}
            isDark={isDark}
          />
        )}

        {iNeedToConfirm && !isDisputeFormVisible && (
          <View style={styles.actions}>
            <PrimaryButton
              label={t('detail.confirmButton')}
              onPress={handleConfirm}
              loading={confirmMatch.isPending}
              isDark={isDark}
            />
            <DangerButton
              label={t('detail.disputeButton')}
              onPress={handleDispute}
              loading={disputeMatch.isPending}
              isDark={isDark}
            />
            <SecondaryButton
              label={
                me?.cancelRequested
                  ? t('detail.cancelAlreadyRequestedButton')
                  : opponentRequestedCancel
                    ? t('detail.acceptCancelButton')
                    : t('detail.requestCancelButton')
              }
              onPress={
                opponentRequestedCancel && !me?.cancelRequested
                  ? handleAcceptCancel
                  : handleCancelRequest
              }
              loading={cancelMatch.isPending}
              disabled={!canRequestCancel}
              isDark={isDark}
            />
          </View>
        )}

        {!iNeedToConfirm &&
          !isDisputeFormVisible &&
          (isPending || isDisputed) && (
            <View style={styles.actions}>
              {opponentRequestedCancel && !me?.cancelRequested && isPending && (
                <DangerButton
                  label={t('detail.disputeButton')}
                  onPress={handleDispute}
                  loading={disputeMatch.isPending}
                  isDark={isDark}
                />
              )}
              <SecondaryButton
                label={
                  me?.cancelRequested
                    ? t('detail.cancelAlreadyRequestedButton')
                    : opponentRequestedCancel
                      ? t('detail.acceptCancelButton')
                      : t('detail.requestCancelButton')
                }
                onPress={
                  opponentRequestedCancel && !me?.cancelRequested
                    ? handleAcceptCancel
                    : handleCancelRequest
                }
                loading={cancelMatch.isPending}
                disabled={!canRequestCancel}
                isDark={isDark}
              />
            </View>
          )}

        {isPending && opponent && (
          <View style={styles.opponentStatus}>
            <Text style={[styles.opponentStatusText, { color: tk.text.muted }]}>
              {t('detail.yourConfirmationState', {
                status: me?.confirmed
                  ? t('detail.confirmedState')
                  : t('detail.awaitingState'),
              })}
            </Text>
            <Text style={[styles.opponentStatusText, { color: tk.text.muted }]}>
              {t('detail.opponentConfirmationState', {
                status: opponent.confirmed
                  ? t('detail.confirmedState')
                  : t('detail.awaitingState'),
              })}
            </Text>
            {me?.cancelRequested && (
              <Text
                style={[styles.opponentStatusText, { color: tk.text.muted }]}
              >
                {t('detail.yourCancellationState', {
                  status: t('detail.cancelRequestedState'),
                })}
              </Text>
            )}
            {opponent.cancelRequested && (
              <Text
                style={[styles.opponentStatusText, { color: tk.text.muted }]}
              >
                {t('detail.opponentCancellationState', {
                  status: t('detail.cancelRequestedState'),
                })}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
};

export default MatchDetailScreen;
