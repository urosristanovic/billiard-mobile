import { useState, useCallback } from 'react';
import {
  ScrollView,
  RefreshControl,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMatchDetail } from '@/features/matches/useMatchDetail';
import { useMatchMutations } from '@/features/matches/useMatchMutations';
import { useAuth } from '@/features/auth/useAuth';
import { useConfirmDialog } from '@/components/common/dialog';
import { ScreenLayout } from '@/components/common/layout';
import { LoadingState, EmptyState, Loading } from '@/components/common/states';
import { useTheme } from '@/hooks/useTheme';
import {
  ScoreBoard,
  DisputeForm,
  DisputeResolution,
  MatchTimeline,
  MatchActions,
  CancellationForm,
  MatchHeader,
  ChallengeScoreCard,
  ChallengeActions,
} from './components';
import { styles } from './styles';
import type { HomeStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'MatchDetail'>;

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

  const {
    data: match,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useMatchDetail(matchId);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);
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
      { matchId: match.id, input },
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

  const raceTo = match.bestOf != null ? Math.ceil(match.bestOf / 2) : null;

  const isDisputeFormVisible =
    activeForm === 'dispute' || activeForm === 'counterDispute';
  const isCancelFormVisible =
    activeForm === 'cancel' || activeForm === 'declineChallenge';

  return (
    <ScreenLayout isDark={isDark}>
      <MatchHeader match={match} onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
      >
        {isRefetching && (
          <View style={styles.refreshingIndicator}>
            <Loading />
          </View>
        )}

        {isChallenge ? (
          <ChallengeScoreCard
            match={match}
            myUserId={user?.id ?? ''}
            raceTo={raceTo}
            isSubmitting={recordChallenge.isPending}
            onRecord={({ myScore, opponentScore, myBeers, opponentBeers }) => {
              recordChallenge.mutate({
                matchId: match.id,
                myScore,
                opponentScore,
                myBeers,
                opponentBeers,
              });
            }}
          />
        ) : (
          <ScoreBoard match={match} myUserId={user?.id ?? ''} isDark={isDark} />
        )}

        {!isDisputeFormVisible &&
          !isCancelFormVisible &&
          isChallengeRequested && (
            <ChallengeActions
              match={match}
              myUserId={user?.id ?? ''}
              isAccepting={acceptChallenge.isPending}
              isDeclining={declineChallenge.isPending}
              isCancelling={cancelChallengeRequest.isPending}
              onAccept={() => acceptChallenge.mutate(match.id)}
              onDecline={() => {
                setCancellationReason('');
                setActiveForm('declineChallenge');
              }}
              onCancelRequest={handleCancelChallengeRequest}
            />
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

        {isDisputed &&
          me &&
          opponent &&
          openDispute &&
          !isDisputeFormVisible && (
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
