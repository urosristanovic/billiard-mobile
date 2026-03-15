import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import { useConfirmDialog } from '@/components/common/dialog';
import {
  useTournamentDetail,
  useTournamentRequests,
} from '@/features/tournaments/useTournamentDetail';
import { useTournamentMutations } from '@/features/tournaments/useTournamentMutations';
import { useAuth } from '@/features/auth/useAuth';
import {
  TOURNAMENT_FORMAT_LABELS,
  TOURNAMENT_STATUS_LABELS,
  type TournamentMatch,
} from '@/types/tournament';
import { DISCIPLINE_LABELS } from '@/types/match';
import {
  ParticipantList,
  BracketViewer,
  StandingsTable,
  CurrentMatches,
  RecordScoreModal,
} from './components';
import { typography, spacing, radius } from '@/constants/theme';
import type { TournamentsStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<
  TournamentsStackParamList,
  'TournamentDetail'
>;

type ActiveTab = 'bracket' | 'standings' | 'participants';

const TournamentDetailScreen = ({ navigation, route }: Props) => {
  const { tournamentId } = route.params;
  const { t } = useTranslation('tournaments');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();
  const { confirm } = useConfirmDialog();
  const [activeTab, setActiveTab] = useState<ActiveTab>('participants');
  const [selectedMatch, setSelectedMatch] = useState<TournamentMatch | null>(
    null,
  );
  const [respondingTo, setRespondingTo] = useState<
    Record<string, 'accepted' | 'rejected'>
  >({});

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

  // Derive organizer/status flags safely before the tournament is loaded
  const isOrganizer = user?.id === tournament?.organizerId;
  const canManageRequests = isOrganizer && tournament?.status === 'registration';

  // ALL hooks must be called before any conditional return
  const {
    data: pendingRequests = [],
    isLoading: requestsLoading,
    isRefetching: requestsRefetching,
    refetch: refetchRequests,
  } = useTournamentRequests(tournamentId, canManageRequests);

  const isRefetching = tournamentRefetching || requestsRefetching;

  const handleRefresh = () => {
    refetch();
    if (canManageRequests) refetchRequests();
  };

  const canRecordMatch = (match: TournamentMatch) =>
    Boolean(
      isOrganizer && match.homeUserId && match.awayUserId && !match.winnerId,
    );

  const canEditMatch = (match: TournamentMatch) => {
    if (!isOrganizer || !match.winnerId) return false;
    if (!['in_progress', 'pending_review'].includes(tournament?.status ?? ''))
      return false;
    // Final match (no next match) is always editable while tournament isn't completed
    if (!match.nextMatchId) return true;
    // Otherwise allow editing only if the downstream match hasn't been played yet
    const nextMatch = tournament?.matches.find(m => m.id === match.nextMatchId);
    return !nextMatch?.winnerId;
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

  const hasStarted = ['in_progress', 'pending_review', 'completed'].includes(
    tournament.status,
  );
  const showBracket = hasStarted && tournament.rounds.length > 0;
  const isRoundRobin = tournament.format === 'round_robin';
  const canStartTournament =
    tournament.participants.length === tournament.maxParticipants;

  const tabs: { key: ActiveTab; label: string }[] = [
    { key: 'participants', label: t('detail.participants') },
    {
      key: 'bracket',
      label: isRoundRobin ? t('detail.standings') : t('detail.bracket'),
    },
    ...(!isRoundRobin
      ? [{ key: 'standings' as ActiveTab, label: t('detail.standings') }]
      : []),
  ];

  return (
    <ScreenLayout isDark={isDark}>
      {/* Sticky top: header + meta + actions + tab bar */}
      <View>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: tk.border.subtle }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole='button'
          >
            <Text style={[styles.back, { color: tk.primary[400] }]}>←</Text>
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: tk.text.primary }]}
            numberOfLines={1}
          >
            {tournament.name}
          </Text>
          <View style={styles.backPlaceholder} />
        </View>

        {/* Meta row */}
        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: tk.surface.overlay,
                  borderColor: tk.border.default,
                },
              ]}
            >
              <Text style={[styles.statusText, { color: tk.primary[400] }]}>
                {TOURNAMENT_STATUS_LABELS[tournament.status]}
              </Text>
            </View>
            <Text style={[styles.metaItem, { color: tk.text.secondary }]}>
              {DISCIPLINE_LABELS[tournament.discipline]}
            </Text>
            <Text style={[styles.dot, { color: tk.text.muted }]}>·</Text>
            <Text style={[styles.metaItem, { color: tk.text.secondary }]}>
              {TOURNAMENT_FORMAT_LABELS[tournament.format]}
            </Text>
          </View>

          <View style={styles.metaDetails}>
            {tournament.location ? (
              <View style={styles.metaDetailRow}>
                <Text style={[styles.metaDetailIcon, { color: tk.text.muted }]}>
                  📍
                </Text>
                <Text
                  style={[styles.metaDetailText, { color: tk.text.primary }]}
                >
                  {tournament.location}
                </Text>
              </View>
            ) : null}
            <View style={styles.metaDetailRow}>
              <Text style={[styles.metaDetailIcon, { color: tk.text.muted }]}>
                🗓
              </Text>
              <Text style={[styles.metaDetailText, { color: tk.text.primary }]}>
                {new Date(tournament.scheduledAt).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.metaDetailRow}>
              <Text style={[styles.metaDetailIcon, { color: tk.text.muted }]}>
                👤
              </Text>
              <Text style={[styles.metaDetailText, { color: tk.text.primary }]}>
                {tournament.organizerProfile.displayName ||
                  tournament.organizerProfile.username}
              </Text>
              <Text style={[styles.metaDetailLabel, { color: tk.text.muted }]}>
                {t('detail.organizer').toLowerCase()}
              </Text>
            </View>
          </View>

          {tournament.description ? (
            <Text style={[styles.description, { color: tk.text.secondary }]}>
              {tournament.description}
            </Text>
          ) : null}
        </View>

        {/* Organizer actions */}
        {isOrganizer && (
          <View style={styles.actionsWrapper}>
            <View style={styles.actions}>
              {/* Primary action */}
              {tournament.status === 'draft' && (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      confirm({
                        title: t('detail.confirmPublish'),
                        message: t('detail.confirmPublishMessage'),
                        confirmLabel: t('detail.actions.publish'),
                        cancelLabel: tCommon('cancel'),
                        onConfirm: () =>
                          publishTournament.mutate(tournament.id),
                      })
                    }
                    disabled={publishTournament.isPending}
                    style={[
                      styles.actionBtn,
                      styles.actionBtnPrimary,
                      {
                        backgroundColor: tk.primary[500],
                        borderColor: tk.primary[700],
                      },
                    ]}
                  >
                    {publishTournament.isPending ? (
                      <ActivityIndicator
                        size='small'
                        color={tk.text.onPrimary}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.actionBtnText,
                          { color: tk.text.onPrimary },
                        ]}
                      >
                        {t('detail.actions.publish')}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('CreateTournament', {
                        tournament,
                      })
                    }
                    style={[
                      styles.actionBtn,
                      {
                        borderColor: tk.primary[600],
                        backgroundColor: tk.surface.overlay,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.actionBtnText, { color: tk.primary[400] }]}
                    >
                      {t('detail.actions.edit')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              {tournament.status === 'registration' && (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      confirm({
                        title: t('detail.confirmStart'),
                        message: t('detail.confirmStartMessage'),
                        confirmLabel: t('detail.actions.start'),
                        cancelLabel: tCommon('cancel'),
                        onConfirm: () => startTournament.mutate(tournament.id),
                      })
                    }
                    disabled={startTournament.isPending || !canStartTournament}
                    style={[
                      styles.actionBtn,
                      styles.actionBtnPrimary,
                      {
                        backgroundColor: canStartTournament
                          ? tk.primary[500]
                          : tk.surface.overlay,
                        borderColor: canStartTournament
                          ? tk.primary[700]
                          : tk.border.default,
                      },
                    ]}
                  >
                    {startTournament.isPending ? (
                      <ActivityIndicator
                        size='small'
                        color={tk.text.onPrimary}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.actionBtnText,
                          {
                            color: canStartTournament
                              ? tk.text.onPrimary
                              : tk.text.muted,
                          },
                        ]}
                      >
                        {t('detail.actions.start')}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('CreateTournament', {
                        tournament,
                      })
                    }
                    style={[
                      styles.actionBtn,
                      {
                        borderColor: tk.primary[600],
                        backgroundColor: tk.surface.overlay,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.actionBtnText, { color: tk.primary[400] }]}
                    >
                      {t('detail.actions.edit')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              {['in_progress', 'pending_review'].includes(
                tournament.status,
              ) && (
                <TouchableOpacity
                  onPress={() =>
                    confirm({
                      title: t('detail.confirmComplete'),
                      message: t('detail.confirmCompleteMessage'),
                      confirmLabel: 'Complete',
                      cancelLabel: tCommon('close'),
                      onConfirm: () => completeTournament.mutate(tournament.id),
                    })
                  }
                  disabled={completeTournament.isPending}
                  style={[
                    styles.actionBtn,
                    styles.actionBtnPrimary,
                    {
                      backgroundColor: tk.primary[500],
                      borderColor: tk.primary[700],
                    },
                  ]}
                >
                  {completeTournament.isPending ? (
                    <ActivityIndicator size='small' color={tk.text.onPrimary} />
                  ) : (
                    <Text
                      style={[
                        styles.actionBtnText,
                        { color: tk.text.onPrimary },
                      ]}
                    >
                      {t('detail.actions.complete')}
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              {/* Cancel */}
              {!['completed', 'cancelled'].includes(tournament.status) && (
                <TouchableOpacity
                  onPress={() =>
                    confirm({
                      title: t('detail.confirmCancel'),
                      message: t('detail.confirmCancelMessage'),
                      confirmLabel: t('detail.actions.cancel'),
                      cancelLabel: tCommon('close'),
                      variant: 'destructive',
                      onConfirm: () => cancelTournament.mutate(tournament.id),
                    })
                  }
                  style={[
                    styles.actionBtn,
                    {
                      borderColor: tk.error.border,
                      backgroundColor: tk.error.dark,
                    },
                  ]}
                >
                  <Text
                    style={[styles.actionBtnText, { color: tk.error.text }]}
                  >
                    {t('detail.actions.cancel')}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Add participants */}
              {['draft', 'registration'].includes(tournament.status) && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('InviteParticipants', {
                      tournamentId: tournament.id,
                    })
                  }
                  disabled={tournament.status === 'draft'}
                  style={[
                    styles.actionBtn,
                    {
                      borderColor: tournament.status === 'draft'
                        ? tk.border.default
                        : tk.primary[600],
                      backgroundColor: tk.surface.overlay,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.actionBtnText,
                      {
                        color: tournament.status === 'draft'
                          ? tk.text.muted
                          : tk.primary[400],
                      },
                    ]}
                  >
                    {t('detail.actions.addParticipants')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {tournament.status === 'registration' && !canStartTournament && (
              <Text style={[styles.startHint, { color: tk.text.muted }]}>
                {t('detail.startRequiresFullRoster', {
                  count: tournament.participants.length,
                  max: tournament.maxParticipants,
                })}
              </Text>
            )}
            {tournament.status === 'draft' && (
              <Text style={[styles.startHint, { color: tk.text.muted }]}>
                {t('detail.publishToAddParticipants')}
              </Text>
            )}
          </View>
        )}

        {tournament.status === 'in_progress' && isOrganizer && (
          <CurrentMatches
            matches={tournament.matches}
            isDark={isDark}
            title={t('detail.currentMatches.title')}
            emptyLabel={t('detail.currentMatches.empty')}
            recordResultLabel={t('detail.currentMatches.recordResult')}
            onRecordResult={setSelectedMatch}
          />
        )}

        {/* Tab bar */}
        <View style={[styles.tabs, { borderBottomColor: tk.border.default }]}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                activeTab === tab.key && {
                  borderBottomColor: tk.primary[500],
                  borderBottomWidth: 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab.key ? tk.primary[400] : tk.text.muted,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
              paddingVertical: 12,
            }}
          >
            <ActivityIndicator size='small' color={tk.primary[600]} />
          </View>
        )}
        <View style={styles.tabContent}>
          {activeTab === 'bracket' &&
            (showBracket ? (
              isRoundRobin ? (
                <StandingsTable
                  matches={tournament.matches}
                  participants={tournament.participants}
                  isDark={isDark}
                />
              ) : (
                <BracketViewer
                  rounds={tournament.rounds}
                  matches={tournament.matches}
                  isDark={isDark}
                  onMatchPress={setSelectedMatch}
                  canInteract={match => canRecordMatch(match) || canEditMatch(match)}
                  recordResultLabel={t('detail.actions.recordResult')}
                  editResultLabel={t('detail.actions.editResult')}
                />
              )
            ) : (
              <Text style={[styles.noBracket, { color: tk.text.muted }]}>
                {t('detail.noBracket')}
              </Text>
            ))}

          {activeTab === 'standings' && !isRoundRobin && (
            <StandingsTable
              matches={tournament.matches}
              participants={tournament.participants}
              isDark={isDark}
            />
          )}

          {activeTab === 'participants' && (
            <View style={styles.participantsTab}>
              {/* Pending requests — organizer only */}
              {canManageRequests &&
                (requestsLoading ||
                  pendingRequests.filter(r => r.direction === 'request')
                    .length > 0) && (
                  <View
                    style={[
                      styles.requestsSection,
                      { borderColor: tk.border.default },
                    ]}
                  >
                    <Text
                      style={[styles.requestsHeader, { color: tk.text.muted }]}
                    >
                      {t('detail.requests.title')}
                      {pendingRequests.filter(r => r.direction === 'request')
                        .length > 0 && (
                        <Text style={{ color: tk.primary[400] }}>
                          {' '}
                          (
                          {
                            pendingRequests.filter(
                              r => r.direction === 'request',
                            ).length
                          }
                          )
                        </Text>
                      )}
                    </Text>

                    {requestsLoading ? (
                      <ActivityIndicator
                        size='small'
                        color={tk.primary[400]}
                        style={{ marginVertical: spacing[3] }}
                      />
                    ) : pendingRequests.filter(r => r.direction === 'request')
                        .length === 0 ? (
                      <Text
                        style={[styles.requestsEmpty, { color: tk.text.muted }]}
                      >
                        {t('detail.requests.empty')}
                      </Text>
                    ) : (
                      pendingRequests
                        .filter(r => r.direction === 'request')
                        .map(req => (
                          <View
                            key={req.id}
                            style={[
                              styles.requestRow,
                              { borderBottomColor: tk.border.subtle },
                            ]}
                          >
                            <View
                              style={[
                                styles.reqAvatar,
                                { backgroundColor: tk.surface.overlay },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.reqAvatarText,
                                  { color: tk.primary[400] },
                                ]}
                              >
                                {(req.profile.displayName ||
                                  req.profile.username)[0]?.toUpperCase()}
                              </Text>
                            </View>
                            <View style={styles.reqInfo}>
                              <Text
                                style={[
                                  styles.reqName,
                                  { color: tk.text.primary },
                                ]}
                              >
                                {req.profile.displayName ||
                                  req.profile.username}
                              </Text>
                              <Text
                                style={[
                                  styles.reqType,
                                  { color: tk.text.muted },
                                ]}
                              >
                                {req.direction === 'request'
                                  ? t('detail.requests.joinRequest')
                                  : t('detail.requests.invitation')}
                              </Text>
                            </View>
                            <View style={styles.reqActions}>
                              {respondingTo[req.id] ? (
                                <ActivityIndicator
                                  size='small'
                                  color={tk.primary[400]}
                                  style={styles.reqLoadingIndicator}
                                />
                              ) : (
                                <>
                                  <TouchableOpacity
                                    onPress={() => {
                                      setRespondingTo(prev => ({
                                        ...prev,
                                        [req.id]: 'accepted',
                                      }));
                                      respondToRequest.mutate(
                                        {
                                          tournamentId,
                                          requestId: req.id,
                                          input: { status: 'accepted' },
                                        },
                                        {
                                          onSettled: () =>
                                            setRespondingTo(prev => {
                                              const next = { ...prev };
                                              delete next[req.id];
                                              return next;
                                            }),
                                        },
                                      );
                                    }}
                                    style={[
                                      styles.reqAccept,
                                      { backgroundColor: tk.primary[500] },
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.reqActionText,
                                        { color: tk.surface.default },
                                      ]}
                                    >
                                      {t('detail.requests.accept')}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      setRespondingTo(prev => ({
                                        ...prev,
                                        [req.id]: 'rejected',
                                      }));
                                      respondToRequest.mutate(
                                        {
                                          tournamentId,
                                          requestId: req.id,
                                          input: { status: 'rejected' },
                                        },
                                        {
                                          onSettled: () =>
                                            setRespondingTo(prev => {
                                              const next = { ...prev };
                                              delete next[req.id];
                                              return next;
                                            }),
                                        },
                                      );
                                    }}
                                    style={[
                                      styles.reqReject,
                                      { borderColor: tk.error.border },
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.reqActionText,
                                        { color: tk.error.text },
                                      ]}
                                    >
                                      {t('detail.requests.reject')}
                                    </Text>
                                  </TouchableOpacity>
                                </>
                              )}
                            </View>
                          </View>
                        ))
                    )}
                  </View>
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[3],
    gap: spacing[6],
  },
  back: {
    fontSize: 22,
    fontFamily: typography.family.display,
  },
  backPlaceholder: {
    width: 32,
  },
  headerTitle: {
    fontSize: typography.size['3xl'],
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
    lineHeight: typography.size['3xl'] * 1.15,
  },
  metaSection: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    gap: spacing[3],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  statusBadge: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  statusText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaItem: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  dot: {
    fontSize: typography.size.sm,
  },
  metaDetails: {
    gap: spacing[2],
  },
  metaDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  metaDetailIcon: {
    fontSize: typography.size.base,
    width: 22,
  },
  metaDetailText: {
    fontSize: typography.size.base,
    fontFamily: typography.family.bodyMedium,
  },
  metaDetailLabel: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  description: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    lineHeight: typography.size.sm * 1.55,
    marginTop: spacing[1],
  },
  actionsWrapper: {
    paddingBottom: spacing[1],
    gap: spacing[2],
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  actionBtn: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  actionBtnPrimary: {},
  actionBtnText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: spacing[4],
  },
  tab: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabContent: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  noBracket: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    textAlign: 'center',
    paddingVertical: spacing[8],
  },
  participantsTab: {
    gap: spacing[5],
  },
  requestsSection: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing[3],
    gap: spacing[1],
  },
  requestsHeader: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[2],
  },
  requestsEmpty: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    paddingVertical: spacing[2],
    textAlign: 'center',
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    gap: spacing[2],
  },
  reqAvatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqAvatarText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
  },
  reqInfo: {
    flex: 1,
    gap: 2,
  },
  reqName: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
  reqType: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
  reqActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  reqAccept: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: radius.md,
  },
  reqReject: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: radius.md,
    borderWidth: 1,
  },
  reqActionText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  reqLoadingIndicator: {
    paddingHorizontal: spacing[4],
  },
  startHint: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    textAlign: 'center',
    paddingHorizontal: spacing[4],
  },
});

export default TournamentDetailScreen;
