import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMatches } from '@/features/matches/useMatches';
import { useMatchStats } from '@/features/matches/useMatchStats';
import { useAuth } from '@/features/auth/useAuth';
import { ScreenLayout } from '@/components/common/layout';
import { AvatarButton } from '@/components/common/buttons';
import { LoadingState, EmptyState } from '@/components/common/states';
import { FloatingActionButton } from '@/components/common/buttons/FloatingActionButton';
import { useTheme } from '@/hooks/useTheme';
import { MatchCard } from '@/screens/match/MatchHistoryScreen/components';
import {
  MatchFilterModal,
  DEFAULT_FILTERS,
  countActiveFilters,
  type MatchFilters,
} from './components/MatchFilterModal';
import { styles } from './styles';
import type { HomeStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('home');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<MatchFilters>(DEFAULT_FILTERS);

  const matchParams = useMemo(
    () => ({
      discipline: appliedFilters.discipline !== 'all' ? appliedFilters.discipline : undefined,
      status: appliedFilters.status !== 'all' ? appliedFilters.status : undefined,
      opponentId: appliedFilters.opponent !== 'all' ? appliedFilters.opponent : undefined,
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

  return (
    <ScreenLayout isDark={isDark}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: tk.text.primary }]}>
            {t('title')}
          </Text>
          <AvatarButton />
        </View>
      </View>

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
          <>
            <View
              style={[
                styles.profileCard,
                {
                  backgroundColor: tk.surface.raised,
                  borderColor: tk.primary[800],
                },
              ]}
            >
              <View
                style={[
                  styles.avatarCircle,
                  {
                    backgroundColor: tk.background.secondary,
                    borderColor: tk.primary[500],
                  },
                ]}
              >
                <Text style={[styles.avatarInitial, { color: tk.primary[300] }]}>
                  {initials}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.displayName, { color: tk.text.primary }]}>
                  {user?.displayName ?? ''}
                </Text>
                <Text style={[styles.username, { color: tk.text.muted }]}>
                  @{user?.username ?? ''}
                </Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: tk.text.primary }]}>
                      {stats.played}
                    </Text>
                    <Text style={[styles.statLabel, { color: tk.text.secondary }]}>
                      {t('stats.played')}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: tk.primary[400] }]}>
                      {stats.winRate}%
                    </Text>
                    <Text style={[styles.statLabel, { color: tk.text.secondary }]}>
                      {t('stats.winRate')}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: tk.text.primary }]}>
                      {stats.winStreak}
                    </Text>
                    <Text style={[styles.statLabel, { color: tk.text.secondary }]}>
                      {t('stats.winStreak')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: tk.text.secondary }]}>
                {t('recentMatches')}
              </Text>
              <TouchableOpacity
                onPress={() => setFilterModalOpen(true)}
                accessibilityRole='button'
                accessibilityLabel={t('filters.title')}
                style={[
                  styles.filterButton,
                  {
                    borderColor: activeFilterCount > 0 ? tk.primary[500] : tk.border.default,
                    backgroundColor: activeFilterCount > 0 ? tk.primary[900] : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonLabel,
                    { color: activeFilterCount > 0 ? tk.primary[300] : tk.text.muted },
                  ]}
                >
                  {t('filters.title')}
                </Text>
                {activeFilterCount > 0 && (
                  <View style={[styles.filterBadge, { backgroundColor: tk.primary[500] }]}>
                    <Text style={[styles.filterBadgeText, { color: tk.background.primary }]}>
                      {activeFilterCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {isRefetching && !isLoading && matches.length > 0 && (
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
          </>
        }
        ListEmptyComponent={
          isLoading || isRefetching ? (
            <LoadingState message={t('noMatches')} isDark={isDark} />
          ) : error ? (
            <EmptyState title={t('noMatches')} isDark={isDark} />
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
            <View style={{ paddingVertical: 12 }}>
              <ActivityIndicator size='small' color={tk.primary[600]} />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            userId={user?.id ?? ''}
            userName={user?.displayName || user?.username}
            onPress={() =>
              navigation.navigate('MatchDetail', { matchId: item.id })
            }
            isDark={isDark}
          />
        )}
      />

      <FloatingActionButton
        label={t('fab.challenge')}
        onPress={() => navigation.navigate('UserSearch')}
        style={{ bottom: 24 }}
      />

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
