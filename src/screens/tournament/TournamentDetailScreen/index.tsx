import { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { useConfirmDialog } from '@/components/common/dialog';
import { ScreenLayout } from '@/components/common/layout';
import { LoadingState, EmptyState, Loading } from '@/components/common/states';
import { SecondaryButton } from '@/components/common/buttons';
import {
  useTournamentDetail,
  useTournamentRequests,
  useStandings,
} from '@/features/tournaments/useTournamentDetail';
import { useTournamentMutations } from '@/features/tournaments/useTournamentMutations';
import { useAuth } from '@/features/auth/useAuth';
import type { TournamentMatch } from '@/types/tournament';
import {
  TournamentHeader,
  TournamentMeta,
  OrganizerActions,
  PendingRequests,
  TabBar,
  ParticipantList,
  BracketViewer,
  StandingsTable,
  CurrentMatches,
  RecordScoreModal,
} from './components';
import type { Tab } from './components';
import { styles } from './styles';
import { spacing } from '@/constants/theme';
import type { TournamentsStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<
  TournamentsStackParamList,
  'TournamentDetail'
>;

type ActiveTab = 'matches' | 'bracket' | 'standings' | 'participants';

const TournamentDetailScreen = ({ navigation, route }: Props) => {
  const { tournamentId } = route.params;
  const { t } = useTranslation('tournaments');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('bracket');
  const [selectedMatch, setSelectedMatch] = useState<TournamentMatch | null>(
    null,
  );

  const {
    data: tournament,
    isLoading,
    isRefetching: tournamentRefetching,
    refetch,
  } = useTournamentDetail(tournamentId);
  const {
    publishTournament,
    startTournament,
    completeTournament,
    cancelTournament,
    respondToRequest,
    reportResult,
    editResult,
  } = useTournamentMutations();

  const { confirm } = useConfirmDialog();

  const isOrganizer = user?.id === tournament?.organizerId;

  const handleCancelTournament = (id: string) =>
    confirm({
      title: t('detail.confirmCancel'),
      message: t('detail.confirmCancelMessage'),
      confirmLabel: t('detail.actions.cancel'),
      cancelLabel: tCommon('close'),
      variant: 'destructive',
      onConfirm: () => cancelTournament.mutate(id),
    });

  const canManageRequests =
    isOrganizer && tournament?.status === 'registration';

  // ALL hooks must be called before any conditional return
  const {
    data: pendingRequests = [],
    isLoading: requestsLoading,
    isRefetching: requestsRefetching,
    refetch: refetchRequests,
  } = useTournamentRequests(tournamentId, canManageRequests);

  const hasStarted = ['in_progress', 'pending_review', 'completed'].includes(
    tournament?.status ?? '',
  );
  const isRoundRobin = tournament?.format === 'round_robin';

  const { data: standings } = useStandings(
    tournamentId,
    isRoundRobin && hasStarted,
  );

  const isRefetching = tournamentRefetching || requestsRefetching;

  const handleRefresh = () => {
    refetch();
    if (canManageRequests) refetchRequests();
  };

  const isEditingMatch = Boolean(selectedMatch?.winnerId);

  const handleRecordScore = (input: {
    homeScore: number;
    awayScore: number;
  }) => {
    if (!selectedMatch) return;

    if (isEditingMatch) {
      editResult.mutate(
        { tournamentId, matchId: selectedMatch.id, input },
        { onSuccess: () => setSelectedMatch(null) },
      );
    } else {
      reportResult.mutate(
        { tournamentId, matchId: selectedMatch.id, input },
        { onSuccess: () => setSelectedMatch(null) },
      );
    }
  };

  if (isLoading) {
    return (
      <ScreenLayout isDark={isDark}>
        <LoadingState message={t('loading')} isDark={isDark} />
      </ScreenLayout>
    );
  }

  if (!tournament) {
    return (
      <ScreenLayout isDark={isDark}>
        <EmptyState title={t('notFound')} isDark={isDark} />
      </ScreenLayout>
    );
  }

  const showBracket = hasStarted && tournament.rounds.length > 0;

  const tabs: Tab<ActiveTab>[] = hasStarted
    ? isRoundRobin
      ? [
          { key: 'matches', label: t('detail.matches') },
          { key: 'standings', label: t('detail.standings') },
        ]
      : [
          { key: 'bracket', label: t('detail.bracket') },
          { key: 'matches', label: t('detail.matches') },
          { key: 'participants', label: t('detail.participants') },
        ]
    : [{ key: 'participants', label: t('detail.participants') }];

  // Fall back to first available tab when active tab is no longer in the list
  const effectiveTab = tabs.some(tab => tab.key === activeTab)
    ? activeTab
    : (tabs[0]?.key ?? 'participants');

  return (
    <ScreenLayout isDark={isDark}>
      {/* Sticky top: header + meta + actions + tab bar */}
      <View>
        <TournamentHeader
          name={tournament.name}
          onBack={() => navigation.goBack()}
        />

        <TournamentMeta
          status={tournament.status}
          isRated={tournament.isRated}
          discipline={tournament.discipline}
          format={tournament.format}
          location={tournament.location}
          scheduledAt={tournament.scheduledAt}
          organizerProfile={tournament.organizerProfile}
          description={tournament.description}
          onCancel={
            isOrganizer &&
            !['completed', 'cancelled'].includes(tournament.status)
              ? () => handleCancelTournament(tournament.id)
              : undefined
          }
        />

        {isOrganizer && (
          <OrganizerActions
            tournament={tournament}
            publishMutation={publishTournament}
            startMutation={startTournament}
            completeMutation={completeTournament}
            onEdit={() =>
              navigation.navigate('CreateTournament', { tournament })
            }
            onInvite={() =>
              navigation.navigate('InviteParticipants', {
                tournamentId: tournament.id,
              })
            }
          />
        )}

        {!isOrganizer &&
          tournament.status === 'registration' &&
          tournament.participants.some(p => p.userId === user?.id) && (
            <View style={styles.participantActionsWrapper}>
              <SecondaryButton
                label={t('detail.actions.addParticipants')}
                compact
                isDark={isDark}
                style={{ shadowOpacity: 0, elevation: 0, flex: 1 }}
                onPress={() =>
                  navigation.navigate('InviteParticipants', {
                    tournamentId: tournament.id,
                  })
                }
              />
            </View>
          )}

        <TabBar
          tabs={tabs}
          activeTab={effectiveTab}
          onTabChange={setActiveTab}
        />
      </View>

      {/* Scrollable tab content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={tk.primary[400]}
          />
        }
      >
        {isRefetching && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: spacing[3],
            }}
          >
            <Loading />
          </View>
        )}

        <View style={styles.tabContent}>
          {effectiveTab === 'matches' && hasStarted && (
            <CurrentMatches
              matches={tournament.matches}
              isDark={isDark}
              title={t('detail.currentMatches.title')}
              emptyLabel={t('detail.currentMatches.empty')}
              recordResultLabel={t('detail.currentMatches.recordResult')}
              onRecordResult={setSelectedMatch}
              canRecord={isOrganizer && tournament.status === 'in_progress'}
            />
          )}

          {effectiveTab === 'bracket' &&
            (showBracket ? (
              <BracketViewer
                rounds={tournament.rounds}
                matches={tournament.matches}
                isDark={isDark}
                onMatchPress={setSelectedMatch}
                canInteract={match => Boolean(match.canRecord || match.canEdit)}
                recordResultLabel={t('detail.actions.recordResult')}
                editResultLabel={t('detail.actions.editResult')}
                waitingLabel={t('detail.waitingPlayers')}
              />
            ) : (
              <Text style={[styles.noBracket, { color: tk.text.muted }]}>
                {t('detail.noBracket')}
              </Text>
            ))}

          {effectiveTab === 'standings' && isRoundRobin && (
            <StandingsTable rows={standings ?? []} isDark={isDark} />
          )}

          {effectiveTab === 'participants' && (
            <View style={styles.participantsTab}>
              {canManageRequests && (
                <PendingRequests
                  requests={pendingRequests}
                  isLoading={requestsLoading}
                  onRespond={(requestId, status, onSettled) => {
                    respondToRequest.mutate(
                      {
                        tournamentId,
                        requestId,
                        input: { status },
                      },
                      { onSettled },
                    );
                  }}
                />
              )}

              <ParticipantList
                participants={tournament.participants}
                maxParticipants={tournament.maxParticipants}
                pendingInvitations={pendingRequests.filter(
                  r => r.direction === 'invitation' && r.status === 'pending',
                )}
                isDark={isDark}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <RecordScoreModal
        visible={Boolean(selectedMatch)}
        match={selectedMatch}
        isDark={isDark}
        title={
          isEditingMatch
            ? t('detail.recordScore.editTitle')
            : t('detail.recordScore.title')
        }
        confirmLabel={t('detail.recordScore.confirm')}
        cancelLabel={tCommon('cancel')}
        loading={isEditingMatch ? editResult.isPending : reportResult.isPending}
        onClose={() => setSelectedMatch(null)}
        onConfirm={handleRecordScore}
      />
    </ScreenLayout>
  );
};

export default TournamentDetailScreen;
