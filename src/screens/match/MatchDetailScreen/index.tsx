import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { spacing, radius, typography, theme } from '@/constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMatchDetail } from '@/features/matches/useMatchDetail';
import { useMatchMutations } from '@/features/matches/useMatchMutations';
import { useAuth } from '@/features/auth/useAuth';
import { useConfirmDialog } from '@/components/common/dialog';
import {
  DangerButton,
  PrimaryButton,
  SecondaryButton,
} from '@/components/common/buttons';
import { ScreenLayout } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import { useTheme } from '@/hooks/useTheme';
import { DISCIPLINE_LABELS } from '@/types/match';
import {
  ScoreBoard,
  DisputeForm,
  DisputeResolution,
  MatchTimeline,
  MatchActions,
  CancellationForm,
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
  const [activeForm, setActiveForm] = useState<
    'none' | 'dispute' | 'counterDispute' | 'cancel' | 'declineChallenge'
  >('none');
  const [disputeReason, setDisputeReason] = useState('');
  const [proposedMyScore, setProposedMyScore] = useState('');
  const [proposedOpponentScore, setProposedOpponentScore] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [disputeValidationError, setDisputeValidationError] = useState<
    string | null
  >(null);
  const [challengeMyScore, setChallengeMyScore] = useState(0);
  const [challengeOpponentScore, setChallengeOpponentScore] = useState(0);
  const [challengeMyBeers, setChallengeMyBeers] = useState(0);
  const [challengeOpponentBeers, setChallengeOpponentBeers] = useState(0);

  const { data: match, isLoading, error } = useMatchDetail(matchId);
  const {
    confirmMatch,
    disputeMatch,
    cancelMatch,
    acceptDispute,
    counterDispute,
    acceptChallenge,
    declineChallenge,
    cancelChallengeRequest,
    recordChallenge,
  } = useMatchMutations();

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
  const isDisputed = match.status === 'disputed';
  const isChallengeRequested = match.status === 'challenge_requested';
  const isChallenge = match.status === 'challenge';
  const openDispute = match.dispute?.status === 'open' ? match.dispute : null;
  const iAmDisputer = openDispute?.disputedBy === user?.id;
  const canResolveDispute = isDisputed && !!openDispute && !iAmDisputer;
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
    challenge_requested: tk.info.default,
    challenge: tk.primary[400],
    pending_confirmation: tk.warning.default,
    confirmed: tk.success.default,
    disputed: tk.error.default,
    cancelled: tk.text.muted,
  };
  const statusBg: Record<string, string> = {
    challenge_requested: tk.info.light,
    challenge: tk.primary[900],
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

  const openDisputeForm = (mode: 'dispute' | 'counterDispute') => {
    const prefilledMyScore =
      mode === 'counterDispute' && openDisputeMyScore !== null
        ? openDisputeMyScore
        : me?.score;
    const prefilledOpponentScore =
      mode === 'counterDispute' && openDisputeOpponentScore !== null
        ? openDisputeOpponentScore
        : opponent?.score;

    setProposedMyScore(
      typeof prefilledMyScore === 'number' ? prefilledMyScore.toString() : '',
    );
    setProposedOpponentScore(
      typeof prefilledOpponentScore === 'number'
        ? prefilledOpponentScore.toString()
        : '',
    );
    setDisputeValidationError(null);
    setDisputeReason('');
    setActiveForm(mode);
  };

  const handleSubmitCancel = () =>
    confirm({
      title: t('detail.cancelWithReasonButton'),
      message: t('detail.acceptCancelMessage'),
      cancelLabel: tCommon('cancel'),
      confirmLabel: tCommon('submit'),
      variant: 'destructive',
      onConfirm: () =>
        cancelMatch.mutate(
          { matchId: match.id, reason: cancellationReason.trim() || undefined },
          {
            onSuccess: () => {
              setActiveForm('none');
              setCancellationReason('');
            },
          },
        ),
    });

  const handleAcceptChallenge = () => {
    acceptChallenge.mutate(match.id);
  };

  const handleCancelChallengeRequest = () =>
    confirm({
      title: t('detail.cancelChallengeRequestTitle'),
      message: t('detail.cancelChallengeRequestMessage'),
      cancelLabel: tCommon('close'),
      confirmLabel: tCommon('cancel'),
      variant: 'destructive',
      onConfirm: () =>
        cancelChallengeRequest.mutate(match.id, {
          onSuccess: () => navigation.goBack(),
        }),
    });

  const handleSubmitChallengeDecline = () => {
    declineChallenge.mutate(
      {
        matchId: match.id,
        reason: cancellationReason.trim() || undefined,
      },
      {
        onSuccess: () => {
          setActiveForm('none');
          setCancellationReason('');
        },
      },
    );
  };

  const handleAcceptCancel = () =>
    confirm({
      title: t('detail.acceptCancelTitle'),
      message: t('detail.acceptCancelMessage'),
      cancelLabel: tCommon('cancel'),
      confirmLabel: t('detail.acceptCorrectionShortButton'),
      variant: 'destructive',
      onConfirm: () => cancelMatch.mutate({ matchId: match.id }),
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
    const input = {
      reason: disputeReason.trim() || undefined,
      proposedScores: {
        [me.userId]: myScore,
        [opponent.userId]: oppScore,
      },
    };

    const mutateDispute =
      activeForm === 'counterDispute' ? counterDispute : disputeMatch;
    mutateDispute.mutate(
      {
        matchId: match.id,
        input,
      },
      {
        onSuccess: () => {
          setActiveForm('none');
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

  const handleRecordChallenge = () => {
    if (challengeMyScore < 0 || challengeOpponentScore < 0) return;
    if (challengeMyScore === challengeOpponentScore) {
      return;
    }
    recordChallenge.mutate({
      matchId: match.id,
      myScore: challengeMyScore,
      opponentScore: challengeOpponentScore,
      myBeers: challengeMyBeers,
      opponentBeers: challengeOpponentBeers,
    });
  };

  const isDisputeFormVisible =
    activeForm === 'dispute' || activeForm === 'counterDispute';
  const isCancelFormVisible =
    activeForm === 'cancel' || activeForm === 'declineChallenge';

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

        {!isDisputeFormVisible && !isCancelFormVisible && isChallengeRequested && (
          <View style={styles.actions}>
            {match.createdBy === user?.id ? (
              <SecondaryButton
                label={t('detail.cancelChallengeRequestButton')}
                onPress={handleCancelChallengeRequest}
                loading={cancelChallengeRequest.isPending}
                isDark={isDark}
              />
            ) : (
              <>
                <PrimaryButton
                  label={t('detail.acceptChallengeButton')}
                  onPress={handleAcceptChallenge}
                  loading={acceptChallenge.isPending}
                  isDark={isDark}
                />
                <DangerButton
                  label={t('detail.declineChallengeButton')}
                  onPress={() => {
                    setCancellationReason('');
                    setActiveForm('declineChallenge');
                  }}
                  loading={declineChallenge.isPending}
                  isDark={isDark}
                />
              </>
            )}
          </View>
        )}

        {!isDisputeFormVisible && !isCancelFormVisible && isChallenge && (
          <View
            style={[
              styles.challengeScoreCard,
              { backgroundColor: tk.surface.raised, borderColor: tk.primary[700] },
            ]}
          >
            <Text style={[styles.challengeScoreTitle, { color: tk.text.secondary }]}>
              {t('detail.recordChallengeScoreTitle')}
            </Text>
            <View style={styles.challengeScoreRow}>
              <Text style={[styles.challengeScoreLabel, { color: tk.text.primary }]}>
                {t('you')}
              </Text>
              <View style={styles.challengeScoreControls}>
                <SecondaryButton
                  label='-'
                  compact
                  onPress={() => setChallengeMyScore(prev => Math.max(0, prev - 1))}
                  isDark={isDark}
                />
                <Text style={[styles.challengeScoreValue, { color: tk.text.primary }]}>
                  {challengeMyScore}
                </Text>
                <SecondaryButton
                  label='+'
                  compact
                  onPress={() => setChallengeMyScore(prev => prev + 1)}
                  isDark={isDark}
                />
              </View>
            </View>
            <View style={styles.challengeScoreRow}>
              <Text style={[styles.challengeScoreLabel, { color: tk.text.primary }]}>
                {opponent?.profile.displayName ?? t('detail.opponent')}
              </Text>
              <View style={styles.challengeScoreControls}>
                <SecondaryButton
                  label='-'
                  compact
                  onPress={() =>
                    setChallengeOpponentScore(prev => Math.max(0, prev - 1))
                  }
                  isDark={isDark}
                />
                <Text style={[styles.challengeScoreValue, { color: tk.text.primary }]}>
                  {challengeOpponentScore}
                </Text>
                <SecondaryButton
                  label='+'
                  compact
                  onPress={() => setChallengeOpponentScore(prev => prev + 1)}
                  isDark={isDark}
                />
              </View>
            </View>
            <View style={{ marginTop: spacing[1], gap: spacing[2] }}>
              {[
                {
                  label: `🍺 ${t('beers.myBeers')}`,
                  value: challengeMyBeers,
                  onDec: () => setChallengeMyBeers(prev => Math.max(0, prev - 1)),
                  onInc: () => setChallengeMyBeers(prev => prev + 1),
                },
                {
                  label: `🍺 ${opponent?.profile.displayName ?? t('detail.opponent')}`,
                  value: challengeOpponentBeers,
                  onDec: () => setChallengeOpponentBeers(prev => Math.max(0, prev - 1)),
                  onInc: () => setChallengeOpponentBeers(prev => prev + 1),
                },
              ].map(item => (
                <View
                  key={item.label}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    borderRadius: radius.lg,
                    borderColor: tk.border.subtle,
                    backgroundColor: tk.surface.default,
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[2],
                  }}
                >
                  <Text style={{ color: tk.text.secondary, fontSize: typography.size.xs, fontFamily: typography.family.heading, textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 }}>
                    {item.label}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                    <SecondaryButton label='-' compact onPress={item.onDec} isDark={isDark} />
                    <Text style={{ color: tk.text.primary, fontFamily: typography.family.display, fontSize: typography.size.xl, minWidth: 28, textAlign: 'center' }}>
                      {item.value}
                    </Text>
                    <SecondaryButton label='+' compact onPress={item.onInc} isDark={isDark} />
                  </View>
                </View>
              ))}
            </View>

            <PrimaryButton
              label={t('detail.recordMatchButton')}
              onPress={handleRecordChallenge}
              loading={recordChallenge.isPending}
              disabled={challengeMyScore === challengeOpponentScore}
              isDark={isDark}
            />
          </View>
        )}

        {!isDisputeFormVisible && !isCancelFormVisible && (
          <MatchActions
            match={match}
            me={me ?? null}
            opponent={opponent ?? null}
            myUserId={user?.id ?? ''}
            isDark={isDark}
            isConfirming={confirmMatch.isPending}
            isDisputing={disputeMatch.isPending}
            isCancelling={cancelMatch.isPending}
            onConfirm={handleConfirm}
            onOpenDispute={() => openDisputeForm('dispute')}
            onOpenCancel={() => {
              setCancellationReason('');
              setActiveForm('cancel');
            }}
            onAcceptCancel={handleAcceptCancel}
          />
        )}

        <CancellationForm
          isVisible={isCancelFormVisible}
          reason={cancellationReason}
          isSubmitting={cancelMatch.isPending || declineChallenge.isPending}
          isDark={isDark}
          onReasonChange={setCancellationReason}
          onSubmit={
            activeForm === 'declineChallenge'
              ? handleSubmitChallengeDecline
              : handleSubmitCancel
          }
          onCancel={() => setActiveForm('none')}
          title={
            activeForm === 'declineChallenge'
              ? t('detail.declineChallengeButton')
              : undefined
          }
          submitLabel={
            activeForm === 'declineChallenge'
              ? t('detail.declineChallengeButton')
              : undefined
          }
        />

        <DisputeForm
          isVisible={isDisputeFormVisible}
          title={
            activeForm === 'counterDispute'
              ? t('detail.counterDisputeButton')
              : undefined
          }
          submitLabel={
            activeForm === 'counterDispute'
              ? t('detail.counterDisputeButton')
              : undefined
          }
          reason={disputeReason}
          myScore={proposedMyScore}
          opponentScore={proposedOpponentScore}
          opponentName={opponent?.profile.displayName ?? t('detail.opponent')}
          validationError={disputeValidationError}
          isSubmitting={disputeMatch.isPending || counterDispute.isPending}
          isDark={isDark}
          onReasonChange={setDisputeReason}
          onMyScoreChange={setProposedMyScore}
          onOpponentScoreChange={setProposedOpponentScore}
          onSubmit={handleSubmitDispute}
          onCancel={() => setActiveForm('none')}
        />

        {isDisputed && me && opponent && openDispute && !isDisputeFormVisible && (
          <DisputeResolution
            reason={openDispute.reason}
            proposedMyScore={openDisputeMyScore}
            proposedOpponentScore={openDisputeOpponentScore}
            currentMyScore={me.score}
            currentOpponentScore={opponent.score}
            opponentName={opponent.profile.displayName}
            canResolve={canResolveDispute}
            isAccepting={acceptDispute.isPending}
            isCountering={counterDispute.isPending}
            isDark={isDark}
            onAccept={handleAcceptDispute}
            onCounter={() => openDisputeForm('counterDispute')}
          />
        )}

        <MatchTimeline
          match={match}
          myUserId={user?.id ?? ''}
          isDark={isDark}
        />
      </ScrollView>
    </ScreenLayout>
  );
};

export default MatchDetailScreen;
