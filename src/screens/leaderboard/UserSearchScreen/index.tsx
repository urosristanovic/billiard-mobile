import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useUserSearch } from '@/features/matches/useUserSearch';
import { useGroupMembers, useGroupMutations } from '@/features/groups/useGroups';
import {
  useCustomLeaderboardMembers,
  useCustomLeaderboardMutations,
} from '@/features/leaderboard/useCustomLeaderboards';
import { ScreenLayout } from '@/components/common/layout';
import { EmptyState } from '@/components/common/states';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius, minTouchTarget } from '@/constants/theme';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';
import type { UserSearchResult } from '@/services/user';

type Props = NativeStackScreenProps<LeaderboardStackParamList, 'UserSearch'>;

const UserSearchScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation('leaderboard');
  const { isDark, tk } = useTheme();
  const { query, setQuery, results, isFetching, isSearchMode } = useUserSearch();
  const [pendingAdds, setPendingAdds] = useState<Set<string>>(new Set());
  const [locallyAdded, setLocallyAdded] = useState<Set<string>>(new Set());
  const groupId = route.params?.groupId;
  const leaderboardId = route.params?.leaderboardId;
  const isAddMode = Boolean(groupId || leaderboardId);
  const { data: groupMembers = [] } = useGroupMembers(groupId ?? '');
  const { data: customMembers = [] } = useCustomLeaderboardMembers(leaderboardId ?? '');
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
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { color: tk.primary[400] }]}
          >
            ← Back
          </Text>
          <Text style={[styles.title, { color: tk.text.primary }]}>
            {t('userSearch.title')}
          </Text>
        </View>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: tk.surface.raised,
              borderColor: tk.primary[700],
              color: tk.text.primary,
            },
          ]}
          placeholder={t('userSearch.placeholder')}
          placeholderTextColor={tk.text.muted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize='none'
          autoCorrect={false}
          autoFocus
        />
      </View>

      {isFetching ? (
        <ActivityIndicator style={styles.loader} color={tk.primary[600]} size='large' />
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
                style={[styles.resultRow, { borderBottomColor: tk.primary[900] }]}
                activeOpacity={0.7}
              >
                <View style={[styles.avatar, { backgroundColor: tk.primary[900], borderColor: tk.primary[700] }]}>
                  <Text style={[styles.avatarText, { color: tk.primary[300] }]}>
                    {item.displayName.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={[styles.resultName, { color: tk.text.primary }]}>
                    {item.displayName}
                  </Text>
                  <Text style={[styles.resultUsername, { color: tk.text.muted }]}>
                    @{item.username}
                    {item.location ? ` · ${item.location}` : ''}
                  </Text>
                </View>

                {isAddMode && (
                  isMember ? (
                    <View style={[styles.statusBadge, { backgroundColor: tk.surface.overlay }]}>
                      <Text style={[styles.statusBadgeText, { color: tk.text.muted }]}>
                        {t('userSearch.alreadyMember')}
                      </Text>
                    </View>
                  ) : isAdded ? (
                    <View style={[styles.statusBadge, { backgroundColor: tk.surface.overlay }]}>
                      <Text style={[styles.statusBadgeText, { color: tk.primary[400] }]}>
                        {t('userSearch.added')}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleAddMember(item)}
                      disabled={isAdding}
                      style={[styles.addButton, { backgroundColor: tk.primary[500] }]}
                    >
                      {isAdding ? (
                        <ActivityIndicator size='small' color={tk.surface.default} />
                      ) : (
                        <Text style={[styles.addButtonText, { color: tk.surface.default }]}>
                          {t('userSearch.add')}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )
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
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[3],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  backButton: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
    minHeight: minTouchTarget,
  },
  loader: {
    marginTop: spacing[8],
  },
  list: {
    paddingHorizontal: spacing[4],
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    gap: spacing[3],
    minHeight: minTouchTarget,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  resultUsername: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    minWidth: 64,
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  addButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  addButtonText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});

export default UserSearchScreen;
