import { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Svg,
  Path,
  Circle,
  Defs,
  RadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMatches } from '@/features/matches/useMatches';
import { useMatchStats } from '@/features/matches/useMatchStats';
import { useAuth } from '@/features/auth/useAuth';
import { ScreenLayout, AppHeader } from '@/components/common/layout';
import { LoadingState, EmptyState, Loading } from '@/components/common/states';
import { FloatingActionButton } from '@/components/common/buttons/FloatingActionButton';
import { GhostButton } from '@/components/common/buttons';
import { CueIcon } from '@/components/common/icons';
import { Feather } from '@expo/vector-icons';
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
import { moderateScale, scale } from '@/utils/scale';
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
          <>
            {isRefetching && !isLoading && matches.length > 0 && (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 20,
                }}
              >
                <Loading />
              </View>
            )}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: tk.surface.default,
                  borderColor: tk.border.strong,
                },
              ]}
            >
              {/* Amber glow blob – radial gradient to mimic web's blur-3xl effect */}
              <Svg style={StyleSheet.absoluteFill} pointerEvents='none'>
                <Defs>
                  <RadialGradient id='glow' cx='100%' cy='0%' r='80%'>
                    <Stop
                      offset='0%'
                      stopColor={tk.primary[500]}
                      stopOpacity='0.1'
                    />
                    <Stop
                      offset='100%'
                      stopColor={tk.primary[500]}
                      stopOpacity='0'
                    />
                  </RadialGradient>
                </Defs>
                <Rect width='100%' height='100%' fill='url(#glow)' />
              </Svg>

              {/* Settings button */}
              <TouchableOpacity
                style={[
                  styles.settingsBtn,
                  {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(255,255,255,0.08)',
                  },
                ]}
                onPress={() => navigation.navigate('Settings')}
                activeOpacity={0.7}
              >
                <Feather
                  name='settings'
                  size={iconSize.lg}
                  color={tk.text.muted}
                />
              </TouchableOpacity>

              {/* Avatar + name row */}
              <View style={styles.userRow}>
                <View>
                  <View
                    style={[styles.avatar, { borderColor: tk.primary[500] }]}
                  >
                    <Text
                      style={[styles.avatarInitial, { color: tk.primary[500] }]}
                    >
                      {initials}
                    </Text>
                  </View>
                  {/* Online dot */}
                  <View
                    style={[
                      styles.dotWrap,
                      { backgroundColor: tk.surface.default },
                    ]}
                  >
                    <View style={styles.dot} />
                  </View>
                </View>

                <View style={styles.userInfo}>
                  <Text
                    style={[styles.displayName, { color: tk.text.primary }]}
                    numberOfLines={1}
                  >
                    {user?.displayName ?? ''}
                  </Text>
                  <Text style={[styles.statusText, { color: tk.text.muted }]}>
                    @{user?.username ?? ''}
                  </Text>
                </View>
              </View>

              {/* Stat sub-cards */}
              <View style={styles.statsRow}>
                {/* Win Record */}
                <View
                  style={[styles.statCard, { borderColor: tk.border.default }]}
                >
                  <Text
                    style={[styles.statCardLabel, { color: tk.text.muted }]}
                  >
                    {t('stats.winRecord')}
                  </Text>
                  <View style={styles.statCardValueRow}>
                    <Text
                      style={[styles.statCardBig, { color: tk.text.primary }]}
                    >
                      {stats.played}
                    </Text>
                    <Text
                      style={[styles.statCardSub, { color: tk.text.muted }]}
                    >
                      {t('stats.played')}
                    </Text>
                  </View>
                  <Text
                    style={[styles.statCardAccent, { color: tk.primary[500] }]}
                  >
                    {stats.winRate}% {t('stats.winRate')}
                  </Text>
                </View>

                {/* Streak */}
                <View
                  style={[styles.statCard, { borderColor: tk.border.default }]}
                >
                  <Text
                    style={[styles.statCardLabel, { color: tk.text.muted }]}
                  >
                    {t('stats.winStreak')}
                  </Text>
                  <Text
                    style={[styles.statCardBig, { color: tk.text.primary }]}
                  >
                    {`W${stats.winStreak > 0 ? stats.winStreak : 0}`}
                  </Text>
                  {/* TODO: Add mini streak graph here */}
                  <View style={styles.miniGraph}>
                    <Svg
                      viewBox='0 0 100 30'
                      preserveAspectRatio='none'
                      style={{ flex: 1 }}
                    >
                      <Path
                        d='M0 25 L20 20 L40 28 L60 15 L80 18 L100 5'
                        fill='none'
                        stroke={tk.primary[500]}
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <Circle cx='100' cy='5' r='3' fill={tk.primary[500]} />
                    </Svg>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: tk.text.secondary }]}>
                {t('recentMatches')}
              </Text>
              <GhostButton
                label={t('filters.title')}
                size='sm'
                icon={
                  activeFilterCount > 0 ? undefined : (
                    <Feather
                      name='sliders'
                      size={iconSize.sm}
                      color={tk.primary[600]}
                    />
                  )
                }
                active={activeFilterCount > 0}
                badge={activeFilterCount}
                isDark={isDark}
                accessibilityLabel={t('filters.title')}
                onPress={() => setFilterModalOpen(true)}
              />
            </View>
          </>
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
