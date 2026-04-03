import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout } from '@/components/common/layout';
import { EmptyState, LoadingState, Loading } from '@/components/common/states';
import { useLeaderboard } from '@/features/leaderboard/useLeaderboard';
import { useMyGroups } from '@/features/groups/useGroups';
import { useMyCustomLeaderboards } from '@/features/leaderboard/useCustomLeaderboards';
import { useAuth } from '@/features/auth/useAuth';
import type { LeaderboardEntry } from '@/types/rating';
import { FloatingActionButton } from '@/components/common/buttons/FloatingActionButton';
import { CueIcon } from '@/components/common/icons';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';
import {
  LeaderboardFilterModal,
  DEFAULT_LB_FILTERS,
  countActiveLbFilters,
  type LeaderboardFilters,
} from './components/LeaderboardFilterModal';
import { LeaderboardEntryRow } from './components/LeaderboardEntryRow';
import { LeaderboardHeader } from './components/LeaderboardHeader';
import { ScopeManageRow } from './components/ScopeManageRow';
import { spacing } from '@/constants/theme';
import { styles } from './styles';

type Props = NativeStackScreenProps<
  LeaderboardStackParamList,
  'LeaderboardMain'
>;

const LeaderboardScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('leaderboard');
  const { t: tHome } = useTranslation('home');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] =
    useState<LeaderboardFilters>(DEFAULT_LB_FILTERS);

  const { data: myGroups = [] } = useMyGroups();
  const { data: myCustomLeaderboards = [] } = useMyCustomLeaderboards();

  useEffect(() => {
    if (filters.scope !== 'group') return;
    if (myGroups.length === 0) {
      setFilters(prev => ({ ...prev, selectedGroupId: undefined }));
      return;
    }
    const exists = filters.selectedGroupId
      ? myGroups.some(g => g.id === filters.selectedGroupId)
      : false;
    if (!exists) {
      setFilters(prev => ({ ...prev, selectedGroupId: myGroups[0].id }));
    }
  }, [filters.scope, filters.selectedGroupId, myGroups]);

  useEffect(() => {
    if (filters.scope !== 'custom') return;
    if (myCustomLeaderboards.length === 0) {
      setFilters(prev => ({ ...prev, selectedLeaderboardId: undefined }));
      return;
    }
    const exists = filters.selectedLeaderboardId
      ? myCustomLeaderboards.some(lb => lb.id === filters.selectedLeaderboardId)
      : false;
    if (!exists) {
      setFilters(prev => ({
        ...prev,
        selectedLeaderboardId: myCustomLeaderboards[0].id,
      }));
    }
  }, [filters.scope, filters.selectedLeaderboardId, myCustomLeaderboards]);

  const leaderboardParams = useMemo(
    () => ({
      scope: filters.scope,
      discipline: filters.discipline,
      countryId:
        filters.scope === 'country'
          ? (user?.countryId ?? undefined)
          : undefined,
      cityId:
        filters.scope === 'city' ? (user?.cityId ?? undefined) : undefined,
      groupId: filters.scope === 'group' ? filters.selectedGroupId : undefined,
      leaderboardId:
        filters.scope === 'custom' ? filters.selectedLeaderboardId : undefined,
      includeProvisional: filters.includeProvisional,
    }),
    [filters, user],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useLeaderboard(leaderboardParams);

  const entries: LeaderboardEntry[] = useMemo(
    () => (data?.pages ?? []).flat(),
    [data],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderEntry = useCallback(
    ({ item }: { item: LeaderboardEntry }) => (
      <LeaderboardEntryRow
        entry={item}
        isMe={item.userId === user?.id}
        onPress={() =>
          navigation.push('PlayerProfile', { userId: item.userId })
        }
      />
    ),
    [navigation, user],
  );

  const scopeBlockedReason: string | null = (() => {
    if (filters.scope === 'country' && !user?.countryId)
      return t('blocked.noCountry');
    if (filters.scope === 'city' && !user?.cityId) return t('blocked.noCity');
    if (filters.scope === 'group' && myGroups.length === 0)
      return t('blocked.noGroups');
    if (filters.scope === 'group' && !filters.selectedGroupId)
      return t('filters.selectGroup');
    if (filters.scope === 'custom' && myCustomLeaderboards.length === 0)
      return t('blocked.noCustomLeaderboards');
    if (filters.scope === 'custom' && !filters.selectedLeaderboardId)
      return t('filters.selectLeaderboard');
    return null;
  })();

  const activeFilterCount = countActiveLbFilters(filters);
  const selectedGroup = myGroups.find(g => g.id === filters.selectedGroupId);
  const selectedLeaderboard = myCustomLeaderboards.find(
    lb => lb.id === filters.selectedLeaderboardId,
  );

  return (
    <ScreenLayout isDark={isDark}>
      <LeaderboardHeader
        activeFilterCount={activeFilterCount}
        onOpenFilters={() => setFilterModalOpen(true)}
        onCreateLeaderboard={() => navigation.push('CreateCustomLeaderboard')}
        onCreateGroup={() => navigation.push('CreateGroup')}
      />

      {filters.scope === 'group' && selectedGroup && (
        <ScopeManageRow
          name={selectedGroup.name}
          onManage={() =>
            navigation.push('GroupDetail', { groupId: selectedGroup.id })
          }
        />
      )}

      {filters.scope === 'custom' && selectedLeaderboard && (
        <ScopeManageRow
          name={selectedLeaderboard.name}
          onManage={() =>
            navigation.push('CustomLeaderboardDetail', {
              leaderboardId: selectedLeaderboard.id,
            })
          }
        />
      )}

      <FlatList
        data={entries}
        keyExtractor={item => `${item.userId}-${item.rank}`}
        renderItem={renderEntry}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 8 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={refetch}
            tintColor={tk.primary[400]}
            colors={[tk.primary[400]]}
          />
        }
        ListEmptyComponent={
          scopeBlockedReason ? (
            <EmptyState
              title={scopeBlockedReason}
              description=''
              isDark={isDark}
            />
          ) : isLoading ? (
            <LoadingState message={t('loading')} isDark={isDark} />
          ) : isError ? (
            <EmptyState
              title={t('loadFailed')}
              description=''
              isDark={isDark}
            />
          ) : (
            <EmptyState
              title={t('empty')}
              description={t('emptyDesc')}
              isDark={isDark}
            />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <Loading />
            </View>
          ) : null
        }
      />

      <View
        style={{
          position: 'absolute',
          bottom: spacing[4],
          left: spacing[5],
          right: spacing[5],
          flexDirection: 'row',
          gap: spacing[3],
        }}
      >
        <View style={{ flex: 1 }} />
        <FloatingActionButton
          label={tHome('fab.challenge')}
          icon={<CueIcon size={18} color={tk.text.onPrimary} />}
          onPress={() => navigation.push('UserSearch')}
          style={{ flex: 1 }}
        />
      </View>

      <LeaderboardFilterModal
        visible={filterModalOpen}
        applied={filters}
        groups={myGroups}
        customLeaderboards={myCustomLeaderboards}
        onClose={() => setFilterModalOpen(false)}
        onApply={setFilters}
      />
    </ScreenLayout>
  );
};

export default LeaderboardScreen;
