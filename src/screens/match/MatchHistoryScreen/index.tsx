import { useEffect, useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMatches } from '@/features/matches/useMatches';
import { useMatchStats } from '@/features/matches/useMatchStats';
import { useOpponents } from '@/features/matches/useOpponents';
import { getOpponentLabel } from '@/features/matches/opponentLabel';
import { useAuth } from '@/features/auth/useAuth';
import { DropdownFilter, type FilterOption } from '@/components/common/filters';
import { ScreenLayout } from '@/components/common/layout';
import { AvatarButton } from '@/components/common/buttons';
import { LoadingState, EmptyState, Loading } from '@/components/common/states';
import { useTheme } from '@/hooks/useTheme';
import {
  DISCIPLINES,
  DISCIPLINE_LABELS,
  MATCH_STATUS_LABELS,
  type Discipline,
  type MatchStatus,
} from '@/types/match';
import { MatchCard } from './components';
import { styles } from './styles';
type LocalStackParamList = {
  MatchHistory: undefined;
  MatchDetail: { matchId: string };
};

type Props = NativeStackScreenProps<LocalStackParamList, 'MatchHistory'>;
type DisciplineFilter = Discipline | 'all';
type OpponentFilter = 'all' | string;
type StatusFilter = MatchStatus | 'all';

const MatchHistoryScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('matches');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();

  const [disciplineFilter, setDisciplineFilter] =
    useState<DisciplineFilter>('all');
  const [opponentFilter, setOpponentFilter] = useState<OpponentFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const baseParams = useMemo(
    () => ({
      discipline: disciplineFilter === 'all' ? undefined : disciplineFilter,
      status: statusFilter === 'all' ? undefined : statusFilter,
    }),
    [disciplineFilter, statusFilter],
  );
  const listParams = useMemo(
    () => ({
      ...baseParams,
      opponentId: opponentFilter === 'all' ? undefined : opponentFilter,
      pageSize: 20,
    }),
    [baseParams, opponentFilter],
  );
  const statsParams = useMemo(
    () => ({
      ...baseParams,
      opponentId: opponentFilter === 'all' ? undefined : opponentFilter,
    }),
    [baseParams, opponentFilter],
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
  } = useMatches(listParams);
  const { data: statsData, refetch: refetchStats } = useMatchStats(statsParams);
  const { data: opponents = [] } = useOpponents(baseParams);
  const matches = useMemo(
    () => data?.pages.flatMap(page => page.data) ?? [],
    [data],
  );

  const disciplineOptions = useMemo<FilterOption[]>(
    () => [
      { value: 'all', label: t('disciplines.all') },
      ...DISCIPLINES.map(d => ({
        value: d,
        label: DISCIPLINE_LABELS[d],
      })),
    ],
    [t],
  );

  const statusOptions = useMemo<FilterOption[]>(
    () => [
      { value: 'all', label: t('disciplines.all') },
      ...Object.entries(MATCH_STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    ],
    [t],
  );

  const opponentOptions = useMemo<FilterOption[]>(() => {
    const allOption: FilterOption = {
      value: 'all',
      label: t('disciplines.all'),
    };

    const userOptions = opponents
      .map(opponent => ({
        value: opponent.id,
        label: getOpponentLabel(opponent),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return [allOption, ...userOptions];
  }, [opponents, t]);

  useEffect(() => {
    if (
      opponentFilter !== 'all' &&
      !opponentOptions.some(option => option.value === opponentFilter)
    ) {
      setOpponentFilter('all');
    }
  }, [opponentFilter, opponentOptions]);

  const stats = statsData ?? { played: 0, wins: 0, winRate: 0, winStreak: 0 };

  return (
    <ScreenLayout isDark={isDark}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: tk.text.primary }]}>
            {t('history.title')}
          </Text>
          <AvatarButton />
        </View>
      </View>

      <View style={styles.filters}>
        <View style={styles.filterBlock}>
          <Text style={[styles.filterLabel, { color: tk.text.secondary }]}>
            {t('history.filters.user')}
          </Text>
          <DropdownFilter
            options={opponentOptions}
            value={opponentFilter}
            onSelect={setOpponentFilter}
            isDark={isDark}
          />
        </View>
        <View style={styles.filterBlock}>
          <Text style={[styles.filterLabel, { color: tk.text.secondary }]}>
            {t('history.filters.game')}
          </Text>
          <DropdownFilter
            options={disciplineOptions}
            value={disciplineFilter}
            onSelect={value => setDisciplineFilter(value as DisciplineFilter)}
            isDark={isDark}
          />
        </View>
        <View style={styles.filterBlock}>
          <Text style={[styles.filterLabel, { color: tk.text.secondary }]}>
            {t('history.filters.status')}
          </Text>
          <DropdownFilter
            options={statusOptions}
            value={statusFilter}
            onSelect={value => setStatusFilter(value as StatusFilter)}
            isDark={isDark}
          />
        </View>
      </View>

      <View
        style={[
          styles.statsContainer,
          {
            backgroundColor: tk.surface.raised,
            borderColor: tk.border.default,
          },
        ]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: tk.text.primary }]}>
            {stats.played}
          </Text>
          <Text style={[styles.statLabel, { color: tk.text.secondary }]}>
            {t('history.stats.played')}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: tk.text.primary }]}>
            {stats.winRate}%
          </Text>
          <Text style={[styles.statLabel, { color: tk.text.secondary }]}>
            {t('history.stats.winRate')}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: tk.text.primary }]}>
            {stats.winStreak}
          </Text>
          <Text style={[styles.statLabel, { color: tk.text.secondary }]}>
            {t('history.stats.winStreak')}
          </Text>
        </View>
      </View>
      <Text style={[styles.statsNote, { color: tk.text.muted }]}>
        {t('history.statsNote')}
      </Text>

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
          isRefetching && !isLoading && matches.length > 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
              }}
            >
              <Loading />
            </View>
          ) : null
        }
        ListEmptyComponent={
          isLoading || isRefetching ? (
            <LoadingState message={t('loading')} isDark={isDark} />
          ) : error ? (
            <EmptyState title={t('loadFailed')} isDark={isDark} />
          ) : (
            <EmptyState
              title={t('history.empty')}
              description={t('history.emptyDesc')}
              isDark={isDark}
            />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 12 }}>
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
    </ScreenLayout>
  );
};

export default MatchHistoryScreen;
