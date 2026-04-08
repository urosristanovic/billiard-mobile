import { useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { Input } from '@/components/common/forms';
import { EmptyState, Loading } from '@/components/common/states';
import { SecondaryButton } from '@/components/common/buttons/SecondaryButton';
import { useTournamentMutations } from '@/features/tournaments/useTournamentMutations';
import {
  useTournamentDetail,
  useTournamentRequests,
} from '@/features/tournaments/useTournamentDetail';
import { useAuth } from '@/features/auth/useAuth';
import { userService } from '@/services/user';
import type { UserSearchResult } from '@/services/user';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { QUERY_KEYS } from '@/config/queryKeys';
import { typography, spacing, radius } from '@/constants/theme';
import { scale } from '@/utils/scale';
import type { TournamentsStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<
  TournamentsStackParamList,
  'InviteParticipants'
>;

const InviteParticipantsScreen = ({ navigation, route }: Props) => {
  const { tournamentId } = route.params;
  const { t } = useTranslation('tournaments');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [pendingInvites, setPendingInvites] = useState<Set<string>>(new Set());
  const [locallyInvited, setLocallyInvited] = useState<Set<string>>(new Set());

  const normalizedQuery = query.trim();
  const isSearchMode = normalizedQuery.length >= 2;

  const { data: tournament } = useTournamentDetail(tournamentId);
  const { data: pendingRequests = [] } = useTournamentRequests(
    tournamentId,
    true,
  );
  const { invitePlayer } = useTournamentMutations();

  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_SEARCH(normalizedQuery),
      'invite-participants',
      tournamentId,
    ],
    queryFn: async () => {
      const token = await getAccessToken();
      return userService.search(token, normalizedQuery, user?.id);
    },
    enabled: !!user && isSearchMode,
    staleTime: 30_000,
  });

  const participantUserIds = new Set(
    tournament?.participants.map(p => p.userId) ?? [],
  );
  const serverInvitedIds = new Set(
    pendingRequests
      .filter(r => r.direction === 'invitation' && r.status === 'pending')
      .map(r => r.userId),
  );

  const handleInvite = (player: UserSearchResult) => {
    setPendingInvites(prev => new Set(prev).add(player.id));
    invitePlayer.mutate(
      { tournamentId, userId: player.id },
      {
        onSuccess: () => {
          setLocallyInvited(prev => new Set(prev).add(player.id));
          setPendingInvites(prev => {
            const next = new Set(prev);
            next.delete(player.id);
            return next;
          });
        },
        onError: () => {
          setPendingInvites(prev => {
            const next = new Set(prev);
            next.delete(player.id);
            return next;
          });
        },
      },
    );
  };

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader
        title={t('inviteParticipants.title')}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.searchWrap}>
        <Input
          variant='search'
          placeholder={t('inviteParticipants.searchPlaceholder')}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>

      {isFetching ? (
        <Loading size='large' style={styles.loader} />
      ) : !isSearchMode ? (
        <EmptyState
          title={t('inviteParticipants.searchHint')}
          isDark={isDark}
        />
      ) : searchResults.length === 0 ? (
        <EmptyState title={t('inviteParticipants.empty')} isDark={isDark} />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isParticipant = participantUserIds.has(item.id);
            const isInvited =
              serverInvitedIds.has(item.id) || locallyInvited.has(item.id);
            const isInviting = pendingInvites.has(item.id);

            return (
              <View
                style={[
                  styles.playerRow,
                  {
                    backgroundColor: tk.surface.default,
                    borderColor: tk.border.default,
                  },
                ]}
              >
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: `${tk.primary[600]}20`,
                      borderColor: tk.border.strong,
                    },
                  ]}
                >
                  <Text style={[styles.avatarText, { color: tk.primary[600] }]}>
                    {(item.displayName || item.username)
                      .slice(0, 2)
                      .toUpperCase()}
                  </Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text
                    style={[styles.displayName, { color: tk.text.primary }]}
                  >
                    {item.displayName || item.username}
                  </Text>
                  <Text style={[styles.username, { color: tk.text.muted }]}>
                    @{item.username}
                    {item.location ? ` · ${item.location}` : ''}
                  </Text>
                </View>
                {isParticipant ? (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: tk.surface.overlay },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: tk.text.muted }]}>
                      {t('inviteParticipants.joined')}
                    </Text>
                  </View>
                ) : isInvited ? (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: tk.surface.overlay },
                    ]}
                  >
                    <Text
                      style={[styles.badgeText, { color: tk.primary[400] }]}
                    >
                      {t('inviteParticipants.invited')}
                    </Text>
                  </View>
                ) : (
                  <SecondaryButton
                    label={t('inviteParticipants.invite')}
                    size='xs'
                    loading={isInviting}
                    disabled={isInviting}
                    isDark={isDark}
                    onPress={() => handleInvite(item)}
                  />
                )}
              </View>
            );
          }}
        />
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  loader: {
    marginTop: spacing[8],
  },
  list: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[10],
    gap: spacing[2],
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: radius['2xl'],
    borderWidth: 1,
    gap: spacing[3],
  },
  avatar: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  playerInfo: { flex: 1 },
  displayName: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
    letterSpacing: typography.letterSpacing.relaxed,
  },
  username: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    minWidth: scale(64),
    alignItems: 'center',
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});

export default InviteParticipantsScreen;
