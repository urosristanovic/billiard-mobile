import { useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMatches } from '@/features/matches/useMatches';
import { useMatchStats } from '@/features/matches/useMatchStats';
import { useAuth } from '@/features/auth/useAuth';
import { ScreenLayout, AppHeader } from '@/components/common/layout';
import { LoadingState, EmptyState, Loading } from '@/components/common/states';
import { FloatingActionButton } from '@/components/common/buttons/FloatingActionButton';
import { CueIcon } from '@/components/common/icons';
import { useTheme } from '@/hooks/useTheme';
import { MatchCard } from '@/screens/match/MatchHistoryScreen/components';
import {
  MatchFilterModal,
  DEFAULT_FILTERS,
  countActiveFilters,
  type MatchFilters,
} from './components/MatchFilterModal';
import { HomeHeader } from './components/HomeHeader';
import { styles } from './styles';
import type { HomeStackParamList } from '@/navigation/AppNavigator';
import { moderateScale } from '@/utils/scale';
import { iconSize } from '@/constants/theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeFeed'>;

const HomeScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('home');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<MatchFilters>(DEFAULT_FILTERS);

  const matchParams = useMemo(
    () => ({
      discipline:
        appliedFilters.discipline !== 'all'
          ? appliedFilters.discipline
          : undefined,
      status:
        appliedFilters.status !== 'all' ? appliedFilters.status : undefined,
      opponentId:
        appliedFilters.opponent !== 'all' ? appliedFilters.opponent : undefined,
      pageSize: 10,
    }),
    [appliedFilters],
  );

  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    fetchNextPage,
  } = useMatches(matchParams);

  const { data: statsData, refetch: refetchStats } = useMatchStats();

  const matches = useMemo(
    () => data?.pages.flatMap(page => page.data) ?? [],
    [data],
  );

  const stats = statsData ?? { played: 0, wins: 0, winRate: 0, winStreak: 0 };

  const initials = (
    user?.displayName?.slice(0, 2) ||
    user?.username?.slice(0, 2) ||
    'U'
  ).toUpperCase();

  const activeFilterCount = countActiveFilters(appliedFilters);

  const handleSettingsPress = useCallback(
    () => navigation.navigate('Settings'),
    [navigation],
  );
  const handleFilterPress = useCallback(() => setFilterModalOpen(true), []);

  const isHeaderRefreshing = isRefetching && !isLoading && matches.length > 0;

  const renderItem = useCallback(
    ({ item }: { item: (typeof matches)[number] }) => (
      <MatchCard
        match={item}
        userId={user?.id ?? ''}
        userName={user?.displayName || user?.username}
        onPress={() => navigation.navigate('MatchDetail', { matchId: item.id })}
        isDark={isDark}
      />
    ),
    [user?.id, user?.displayName, user?.username, navigation, isDark],
  );

  return (
    <ScreenLayout isDark={isDark}>
      <AppHeader />

      <FlatList
        data={matches}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={() => {
          refetch();
          refetchStats();
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={
          <HomeHeader
            tk={tk}
            isDark={isDark}
            initials={initials}
            displayName={user?.displayName ?? ''}
            username={user?.username ?? ''}
            stats={stats}
            activeFilterCount={activeFilterCount}
            isRefreshing={isHeaderRefreshing}
            onSettingsPress={handleSettingsPress}
            onFilterPress={handleFilterPress}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingState isDark={isDark} />
          ) : error ? (
            <EmptyState title={t('noMatches')} isDark={isDark} />
          ) : activeFilterCount > 0 ? (
            <EmptyState
              title={t('noMatchesFiltered')}
              description={t('noMatchesFilteredDesc')}
              isDark={isDark}
            />
          ) : (
            <EmptyState
              title={t('noMatches')}
              description={t('noMatchesDesc')}
              isDark={isDark}
            />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: moderateScale(12) }}>
              <Loading />
            </View>
          ) : null
        }
        renderItem={renderItem}
      />

      <View style={styles.fabRow}>
        <View style={{ flex: 1 }} />
        <FloatingActionButton
          label={t('fab.challenge')}
          icon={<CueIcon size={iconSize.md} color={tk.text.onPrimary} />}
          onPress={() => navigation.navigate('UserSearch')}
          style={{ flex: 1 }}
        />
      </View>

      <MatchFilterModal
        visible={filterModalOpen}
        applied={appliedFilters}
        onClose={() => setFilterModalOpen(false)}
        onApply={setAppliedFilters}
      />
    </ScreenLayout>
  );
};

export default HomeScreen;
