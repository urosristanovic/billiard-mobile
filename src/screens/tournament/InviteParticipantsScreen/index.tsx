import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { EmptyState } from '@/components/common/states';
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
    queryKey: [...QUERY_KEYS.USER_SEARCH(normalizedQuery), 'invite-participants', tournamentId],
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

      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: tk.surface.raised,
              borderColor: tk.primary[700],
              color: tk.text.primary,
            },
          ]}
          placeholder={t('inviteParticipants.searchPlaceholder')}
          placeholderTextColor={tk.text.muted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize='none'
          autoCorrect={false}
          autoFocus
        />
      </View>

      {isFetching ? (
        <ActivityIndicator
          style={styles.loader}
          color={tk.primary[600]}
          size='large'
        />
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
                    backgroundColor: tk.surface.raised,
                    borderColor: tk.primary[800],
                  },
                ]}
              >
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: tk.background.secondary,
                      borderColor: tk.primary[600],
                    },
                  ]}
                >
                  <Text style={[styles.avatarText, { color: tk.primary[300] }]}>
                    {(item.displayName || item.username)
                      .charAt(0)
                      .toUpperCase()}
                  </Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={[styles.displayName, { color: tk.text.primary }]}>
                    {item.displayName || item.username}
                  </Text>
                  <Text style={[styles.username, { color: tk.text.muted }]}>
                    @{item.username}
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
                  <TouchableOpacity
                    onPress={() => handleInvite(item)}
                    disabled={isInviting}
                    style={[
                      styles.inviteButton,
                      { backgroundColor: tk.primary[500] },
                    ]}
                  >
                    {isInviting ? (
                      <ActivityIndicator
                        size='small'
                        color={tk.surface.default}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.inviteText,
                          { color: tk.surface.default },
                        ]}
                      >
                        {t('inviteParticipants.invite')}
                      </Text>
                    )}
                  </TouchableOpacity>
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
  searchContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
  },
  loader: {
    marginTop: spacing[8],
  },
  list: {
    padding: spacing[4],
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[3],
    marginBottom: spacing[2],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarText: {
    fontSize: typography.size.lg,
    fontFamily: typography.family.display,
  },
  playerInfo: {
    flex: 1,
    gap: 2,
  },
  displayName: {
    fontSize: typography.size.base,
    fontFamily: typography.family.bodySemibold,
  },
  username: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  badge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  inviteButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  inviteText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});

export default InviteParticipantsScreen;
