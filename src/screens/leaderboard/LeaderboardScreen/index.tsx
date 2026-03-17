import { useState, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout } from '@/components/common/layout';
import { EmptyState, LoadingState } from '@/components/common/states';
import { useLeaderboard } from '@/features/leaderboard/useLeaderboard';
import { useMyGroups } from '@/features/groups/useGroups';
import { useMyCustomLeaderboards } from '@/features/leaderboard/useCustomLeaderboards';
import { useAuth } from '@/features/auth/useAuth';
import { DISCIPLINES, DISCIPLINE_LABELS, type Discipline } from '@/types/match';
import type { LeaderboardScope, LeaderboardEntry } from '@/types/rating';
import { typography, spacing, radius } from '@/constants/theme';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<LeaderboardStackParamList, 'LeaderboardMain'>;

const SCOPES: LeaderboardScope[] = ['global', 'country', 'city', 'group', 'custom'];

const LeaderboardScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('leaderboard');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();

  const [scope, setScope] = useState<LeaderboardScope>('global');
  const [discipline, setDiscipline] = useState<Discipline>('8ball');
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();
  const [selectedLeaderboardId, setSelectedLeaderboardId] = useState<string | undefined>();
  const [includeProvisional, setIncludeProvisional] = useState(true);

  const { data: myGroups = [] } = useMyGroups();
  const { data: myLeaderboards = [] } = useMyCustomLeaderboards();

  const leaderboardParams = useMemo(() => ({
    scope,
    discipline,
    countryId: scope === 'country' ? (user?.countryId ?? undefined) : undefined,
    cityId: scope === 'city' ? (user?.cityId ?? undefined) : undefined,
    groupId: scope === 'group' ? selectedGroupId : undefined,
    leaderboardId: scope === 'custom' ? selectedLeaderboardId : undefined,
    includeProvisional,
  }), [scope, discipline, user, selectedGroupId, selectedLeaderboardId, includeProvisional]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch, isRefetching } =
    useLeaderboard(leaderboardParams);

  const entries: LeaderboardEntry[] = useMemo(
    () => (data?.pages ?? []).flat(),
    [data],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderEntry = useCallback(({ item }: { item: LeaderboardEntry }) => (
    <TouchableOpacity
      onPress={() => navigation.push('PlayerProfile', { userId: item.userId })}
      style={[styles.entryRow, { borderBottomColor: tk.primary[900] }]}
      activeOpacity={0.7}
    >
      <View style={[styles.rankBadge, { backgroundColor: tk.primary[900] }]}>
        <Text style={[styles.rankText, { color: tk.primary[300] }]}>
          {t('entry.rank', { rank: item.rank })}
        </Text>
      </View>
      <View style={styles.entryInfo}>
        <Text style={[styles.entryName, { color: tk.text.primary }]} numberOfLines={1}>
          {item.displayName}
        </Text>
        <Text style={[styles.entryUsername, { color: tk.text.muted }]} numberOfLines={1}>
          @{item.username}
          {item.country ? ` · ${item.country}` : ''}
          {item.city ? `, ${item.city}` : ''}
        </Text>
      </View>
      <View style={styles.entryStats}>
        <View style={styles.entryRatingRow}>
          {item.ratingChange != null && item.ratingChange !== 0 && (
            <Text style={[
              styles.entryRatingChange,
              { color: item.ratingChange > 0 ? '#4ade80' : '#f87171' },
            ]}>
              {item.ratingChange > 0 ? `+${item.ratingChange}` : item.ratingChange}
            </Text>
          )}
          <Text style={[styles.entryRating, { color: tk.text.primary }]}>
            {Math.round(item.rating)}
          </Text>
        </View>
        <Text style={[styles.entryWL, { color: tk.text.muted }]}>
          {item.wins}W {item.losses}L
        </Text>
        {item.isProvisional && (
          <View style={[styles.provisionalBadge, { backgroundColor: tk.primary[800] }]}>
            <Text style={[styles.provisionalText, { color: tk.primary[300] }]}>
              {t('entry.provisional')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  ), [navigation, t, tk]);

  const scopeBlockedReason: string | null = (() => {
    if (scope === 'country' && !user?.countryId) return t('blocked.noCountry');
    if (scope === 'city'    && !user?.cityId)    return t('blocked.noCity');
    if (scope === 'group'   && myGroups.length === 0)       return t('blocked.noGroups');
    if (scope === 'group'   && !selectedGroupId)            return t('filters.selectGroup');
    if (scope === 'custom'  && myLeaderboards.length === 0) return t('blocked.noCustomLeaderboards');
    if (scope === 'custom'  && !selectedLeaderboardId)      return t('filters.selectLeaderboard');
    return null;
  })();

  return (
    <ScreenLayout isDark={isDark}>
      {/* Scope picker */}
      <View style={[styles.header, { borderBottomColor: tk.primary[900] }]}>
        <Text style={[styles.title, { color: tk.text.primary }]}>
          {t('title')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scopeScroll}>
          {SCOPES.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => {
                setScope(s);
                if (s === 'group' && myGroups.length > 0) setSelectedGroupId(myGroups[0].id);
                if (s === 'custom' && myLeaderboards.length > 0) setSelectedLeaderboardId(myLeaderboards[0].id);
              }}
              style={[
                styles.scopePill,
                { borderColor: tk.primary[700] },
                scope === s && { backgroundColor: tk.primary[500] },
              ]}
            >
              <Text
                style={[
                  styles.scopePillText,
                  { color: scope === s ? tk.text.onPrimary : tk.text.secondary },
                ]}
              >
                {t(`scopes.${s === 'group' ? 'groups' : s}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Secondary picker for group */}
        {scope === 'group' && myGroups.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.secondaryScroll}>
            {myGroups.map(g => (
              <TouchableOpacity
                key={g.id}
                onPress={() => setSelectedGroupId(g.id)}
                style={[
                  styles.scopePill,
                  styles.secondaryPill,
                  { borderColor: tk.primary[700] },
                  selectedGroupId === g.id && { backgroundColor: tk.primary[700] },
                ]}
              >
                <Text style={[styles.scopePillText, { color: tk.text.secondary }]}>
                  {g.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Secondary picker for custom leaderboard */}
        {scope === 'custom' && myLeaderboards.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.secondaryScroll}>
            {myLeaderboards.map(lb => (
              <TouchableOpacity
                key={lb.id}
                onPress={() => setSelectedLeaderboardId(lb.id)}
                style={[
                  styles.scopePill,
                  styles.secondaryPill,
                  { borderColor: tk.primary[700] },
                  selectedLeaderboardId === lb.id && { backgroundColor: tk.primary[700] },
                ]}
              >
                <Text style={[styles.scopePillText, { color: tk.text.secondary }]}>
                  {lb.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Discipline tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.disciplineScroll}>
          {DISCIPLINES.map(d => (
            <TouchableOpacity
              key={d}
              onPress={() => setDiscipline(d)}
              style={[
                styles.disciplineTab,
                { borderBottomColor: discipline === d ? tk.primary[400] : 'transparent' },
              ]}
            >
              <Text
                style={[
                  styles.disciplineTabText,
                  { color: discipline === d ? tk.primary[400] : tk.text.muted },
                ]}
              >
                {DISCIPLINE_LABELS[d]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Provisional toggle */}
        <View style={styles.provisionalToggle}>
          <Text style={[styles.toggleLabel, { color: tk.text.muted }]}>
            {t('filters.includeProvisional')}
          </Text>
          <Switch
            value={includeProvisional}
            onValueChange={setIncludeProvisional}
            trackColor={{ false: tk.primary[800], true: tk.primary[500] }}
            thumbColor={tk.text.onPrimary}
            style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
          />
        </View>
      </View>

      {/* Manage buttons for group/custom scopes */}
      {(scope === 'group' || scope === 'custom') && (
        <View style={[styles.manageRow, { borderBottomColor: tk.primary[900] }]}>
          <TouchableOpacity
            onPress={() =>
              scope === 'group'
                ? navigation.push('CreateGroup')
                : navigation.push('CreateCustomLeaderboard')
            }
            style={[styles.manageButton, { borderColor: tk.primary[700] }]}
          >
            <Text style={[styles.manageButtonText, { color: tk.primary[400] }]}>
              + {scope === 'group' ? t('..groups..create', { ns: 'groups', defaultValue: 'New Group' }) : 'New Leaderboard'}
            </Text>
          </TouchableOpacity>
          {scope === 'group' && selectedGroupId && (
            <TouchableOpacity
              onPress={() => navigation.push('GroupDetail', { groupId: selectedGroupId })}
              style={[styles.manageButton, { borderColor: tk.primary[700] }]}
            >
              <Text style={[styles.manageButtonText, { color: tk.text.muted }]}>Manage</Text>
            </TouchableOpacity>
          )}
          {scope === 'custom' && selectedLeaderboardId && (
            <TouchableOpacity
              onPress={() => navigation.push('CustomLeaderboardDetail', { leaderboardId: selectedLeaderboardId })}
              style={[styles.manageButton, { borderColor: tk.primary[700] }]}
            >
              <Text style={[styles.manageButtonText, { color: tk.text.muted }]}>Manage</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Content */}
      <FlatList
        data={entries}
        keyExtractor={item => `${item.userId}-${item.rank}`}
        renderItem={renderEntry}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={refetch}
            tintColor={tk.primary[400]}
            colors={[tk.primary[400]]}
          />
        }
        ListHeaderComponent={
          isRefetching && !isLoading && entries.length > 0 ? (
            <View style={styles.refreshingIndicator}>
              <ActivityIndicator size='small' color={tk.primary[400]} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          scopeBlockedReason ? (
            <EmptyState title={scopeBlockedReason} description='' isDark={isDark} />
          ) : isLoading ? (
            <LoadingState message={t('loading')} isDark={isDark} />
          ) : isError ? (
            <EmptyState title={t('loadFailed')} description='' isDark={isDark} />
          ) : (
            <EmptyState title={t('empty')} description={t('emptyDesc')} isDark={isDark} />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size='small' color={tk.primary[400]} />
            </View>
          ) : null
        }
      />

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.push('UserSearch')}
        style={[styles.fab, { backgroundColor: tk.primary[500], borderColor: tk.primary[700] }]}
        activeOpacity={0.8}
      >
        <Text style={[styles.fabIcon, { color: tk.text.onPrimary }]}>↗</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[2],
    borderBottomWidth: 1,
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[3],
  },
  scopeScroll: { marginBottom: spacing[2] },
  secondaryScroll: { marginBottom: spacing[2] },
  disciplineScroll: { marginBottom: spacing[2] },
  scopePill: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing[2],
  },
  scopePillText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  secondaryPill: {
    borderRadius: radius.sm,
  },
  disciplineTab: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    marginRight: spacing[2],
    borderBottomWidth: 2,
  },
  disciplineTabText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
  },
  provisionalToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[1],
  },
  toggleLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
  manageRow: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
  },
  manageButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  manageButtonText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    gap: spacing[3],
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  entryInfo: { flex: 1 },
  entryName: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
  },
  entryUsername: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    marginTop: 2,
  },
  entryStats: {
    alignItems: 'flex-end',
    gap: 2,
  },
  entryRatingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[1],
  },
  entryRating: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  entryRatingChange: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.semibold,
  },
  entryWL: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
  provisionalBadge: {
    paddingHorizontal: spacing[1],
    paddingVertical: 1,
    borderRadius: radius.sm,
  },
  provisionalText: {
    fontSize: 9,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  refreshingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
  },
  footerLoader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
  },
  fab: {
    position: 'absolute',
    bottom: spacing[6],
    right: spacing[4],
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 20,
    fontFamily: typography.family.display,
  },
});

export default LeaderboardScreen;
