import { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useUserSearch } from '@/features/matches/useUserSearch';
import {
  useGroupMembers,
  useGroupMutations,
} from '@/features/groups/useGroups';
import {
  useCustomLeaderboardMembers,
  useCustomLeaderboardMutations,
} from '@/features/leaderboard/useCustomLeaderboards';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { Input } from '@/components/common/forms';
import { EmptyState, Loading } from '@/components/common/states';
import { SecondaryButton } from '@/components/common/buttons/SecondaryButton';
import { ChevronRightIcon } from '@/components/common/icons';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius, iconSize } from '@/constants/theme';
import { scale } from '@/utils/scale';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';
import type { UserSearchResult } from '@/services/user';

type Props = NativeStackScreenProps<LeaderboardStackParamList, 'UserSearch'>;

const UserSearchScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation('leaderboard');
  const { isDark, tk } = useTheme();
  const { query, setQuery, results, isFetching, isSearchMode } =
    useUserSearch();
  const [pendingAdds, setPendingAdds] = useState<Set<string>>(new Set());
  const [locallyAdded, setLocallyAdded] = useState<Set<string>>(new Set());
  const groupId = route.params?.groupId;
  const leaderboardId = route.params?.leaderboardId;
  const isAddMode = Boolean(groupId || leaderboardId);
  const { data: groupMembers = [] } = useGroupMembers(groupId ?? '');
  const { data: customMembers = [] } = useCustomLeaderboardMembers(
    leaderboardId ?? '',
  );
  const { addMember: addGroupMember } = useGroupMutations();
  const { addMember: addCustomMember } = useCustomLeaderboardMutations();

  const memberIds = useMemo(() => {
    const source = groupId ? groupMembers : customMembers;
    return new Set(source.map(member => member.userId));
  }, [groupId, groupMembers, customMembers]);

  const handleAddMember = (user: UserSearchResult) => {
    if (!isAddMode) return;

    setPendingAdds(prev => new Set(prev).add(user.id));

    if (groupId) {
      addGroupMember.mutate(
        { groupId, userId: user.id },
        {
          onSuccess: () => setLocallyAdded(prev => new Set(prev).add(user.id)),
          onSettled: () =>
            setPendingAdds(prev => {
              const next = new Set(prev);
              next.delete(user.id);
              return next;
            }),
        },
      );
      return;
    }

    if (leaderboardId) {
      addCustomMember.mutate(
        { leaderboardId, userId: user.id },
        {
          onSuccess: () => setLocallyAdded(prev => new Set(prev).add(user.id)),
          onSettled: () =>
            setPendingAdds(prev => {
              const next = new Set(prev);
              next.delete(user.id);
              return next;
            }),
        },
      );
    }
  };

  const handleSelect = (user: UserSearchResult) => {
    if (isAddMode) return;
    navigation.push('PlayerProfile', { userId: user.id });
  };

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader
        title={t('userSearch.title')}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.searchWrap}>
        <Input
          variant='search'
          placeholder={t('userSearch.placeholder')}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>

      {isFetching ? (
        <Loading size='large' style={styles.loader} />
      ) : results.length === 0 && isSearchMode ? (
        <EmptyState
          title={t('userSearch.empty')}
          description={t('userSearch.emptyDesc')}
          isDark={isDark}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isMember = memberIds.has(item.id);
            const isAdded = locallyAdded.has(item.id);
            const isAdding = pendingAdds.has(item.id);

            return (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={[
                  styles.resultRow,
                  {
                    backgroundColor: tk.surface.default,
                    borderColor: tk.border.default,
                  },
                ]}
                activeOpacity={0.75}
              >
                {/* Avatar */}
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
                    {item.displayName.slice(0, 2).toUpperCase()}
                  </Text>
                </View>

                {/* Name + handle */}
                <View style={styles.resultInfo}>
                  <Text style={[styles.resultName, { color: tk.text.primary }]}>
                    {item.displayName}
                  </Text>
                  <Text
                    style={[styles.resultUsername, { color: tk.text.muted }]}
                  >
                    @{item.username}
                    {item.location ? ` · ${item.location}` : ''}
                  </Text>
                </View>

                {/* Right-side action */}
                {isAddMode ? (
                  isMember ? (
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: tk.surface.overlay },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: tk.text.muted },
                        ]}
                      >
                        {t('userSearch.alreadyMember')}
                      </Text>
                    </View>
                  ) : isAdded ? (
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: tk.surface.overlay },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: tk.primary[400] },
                        ]}
                      >
                        {t('userSearch.added')}
                      </Text>
                    </View>
                  ) : (
                    <SecondaryButton
                      label={t('userSearch.add')}
                      size='xs'
                      loading={isAdding}
                      disabled={isAdding}
                      isDark={isDark}
                      onPress={() => handleAddMember(item)}
                    />
                  )
                ) : (
                  <ChevronRightIcon size={scale(16)} color={tk.primary[600]} />
                )}
              </TouchableOpacity>
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

  // ── List ───────────────────────────────────────────────────
  loader: {
    marginTop: spacing[8],
  },
  list: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[10],
    gap: spacing[2],
  },
  resultRow: {
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
  resultInfo: { flex: 1 },
  resultName: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
    letterSpacing: typography.letterSpacing.relaxed,
  },
  resultUsername: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    marginTop: 2,
  },

  // ── Action buttons ─────────────────────────────────────────
  statusBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    minWidth: scale(64),
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});

export default UserSearchScreen;
