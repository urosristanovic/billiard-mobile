import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout } from '@/components/common/layout';
import { EmptyState, Loading, LoadingState } from '@/components/common/states';
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
import { FloatingActionButton } from '@/components/common/buttons/FloatingActionButton';
import { useConfirmDialog } from '@/components/common/dialog';
import { useToast } from '@/components/common/toast';
import { AppLogo } from '@/components/common/AppLogo';
import { useLeaderboard } from '@/features/leaderboard/useLeaderboard';
import {
  useMyCustomLeaderboards,
  useLeaveLeaderboard,
} from '@/features/leaderboard/useCustomLeaderboards';
import { useDefaultLeaderboard } from '@/features/leaderboard/useDefaultLeaderboard';
import { useAuth } from '@/features/auth/useAuth';
import type { LeaderboardEntry } from '@/types/rating';
import { typography, spacing, iconSize, radius } from '@/constants/theme';
import { verticalScale } from '@/utils/scale';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';
import { LeaderboardEntryRow } from './components/LeaderboardEntryRow';
import {
  LeaderboardContextMenu,
  type ContextMenuAction,
  type MenuAnchor,
} from './components/LeaderboardContextMenu';
import {
  LeaderboardFilterModal,
  DEFAULT_LB_FILTERS,
  countActiveLbFilters,
  type LeaderboardFilters,
} from './components/LeaderboardFilterModal';

type Props = NativeStackScreenProps<
  LeaderboardStackParamList,
  'LeaderboardMain'
>;

const LeaderboardScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('leaderboard');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();
  const { confirm } = useConfirmDialog();
  const { showToast } = useToast();
  const { defaultLeaderboardId, setDefault } = useDefaultLeaderboard();

  const [selectedLeaderboardId, setSelectedLeaderboardId] = useState<
    string | undefined
  >();
  const [modalFilters, setModalFilters] =
    useState<LeaderboardFilters>(DEFAULT_LB_FILTERS);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);
  const menuBtnRef = useRef<View>(null);

  const {
    data: leaderboards = [],
    isLoading: lbsLoading,
    refetch: refetchLeaderboards,
    isRefetching: isRefetchingLeaderboards,
  } = useMyCustomLeaderboards();
  const leaveLeaderboard = useLeaveLeaderboard();

  // Auto-select: once leaderboards are loaded, pick the default (or first).
  // Runs again if defaultLeaderboardId changes (e.g. after "Set as Default").
  // Uses a ref to avoid overwriting the user's manual selection after init.
  const didInit = useRef(false);
  useEffect(() => {
    if (lbsLoading || leaderboards.length === 0) return;
    if (!didInit.current) {
      // First load — always apply the default / first preference
      didInit.current = true;
      const preferred = defaultLeaderboardId
        ? leaderboards.find(lb => lb.id === defaultLeaderboardId)
        : null;
      setSelectedLeaderboardId(preferred?.id ?? leaderboards[0].id);
    } else if (
      defaultLeaderboardId &&
      selectedLeaderboardId !== defaultLeaderboardId
    ) {
      // Default changed mid-session (user just set it) — navigate to it
      setSelectedLeaderboardId(defaultLeaderboardId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lbsLoading, leaderboards, defaultLeaderboardId]);

  const selectedLeaderboard = leaderboards.find(
    lb => lb.id === selectedLeaderboardId,
  );

  const naturalDefaultId = defaultLeaderboardId ?? leaderboards[0]?.id;
  const activeFilterCount = countActiveLbFilters(
    { ...modalFilters, selectedLeaderboardId },
    naturalDefaultId,
  );

  // Rankings for the selected leaderboard
  const {
    data: rankingsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: rankingsLoading,
    isError: rankingsError,
    refetch,
    isRefetching,
  } = useLeaderboard({
    scope: 'custom',
    leaderboardId: selectedLeaderboardId,
    discipline: '8ball',
    includeProvisional: modalFilters.includeProvisional,
  });

  const entries: LeaderboardEntry[] = useMemo(
    () => (rankingsData?.pages ?? []).flat(),
    [rankingsData],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleApplyFilters = useCallback((newFilters: LeaderboardFilters) => {
    setModalFilters(newFilters);
    if (newFilters.selectedLeaderboardId) {
      setSelectedLeaderboardId(newFilters.selectedLeaderboardId);
    }
  }, []);

  const handleMenuAction = useCallback(
    (action: ContextMenuAction) => {
      if (!selectedLeaderboard) return;
      const lb = selectedLeaderboard;

      switch (action) {
        case 'open':
        case 'seeDetails':
          navigation.push('CustomLeaderboardDetail', { leaderboardId: lb.id });
          break;
        case 'createNew':
          navigation.push('CreateCustomLeaderboard');
          break;
        case 'edit':
          navigation.push('CustomLeaderboardDetail', { leaderboardId: lb.id });
          break;
        case 'setDefault':
          setDefault.mutate(lb.id, {
            onSuccess: () => {
              showToast({
                type: 'success',
                title: t('contextMenu.setDefaultSuccess'),
              });
            },
            onError: err => {
              showToast({
                type: 'error',
                title: t('contextMenu.setDefaultError'),
                message: err instanceof Error ? err.message : undefined,
              });
            },
          });
          break;
        case 'leave':
          confirm({
            title: t('leaveConfirmTitle'),
            message: t('leaveConfirmMessage'),
            confirmLabel: t('contextMenu.leave'),
            cancelLabel: tCommon('cancel'),
            variant: 'destructive',
            onConfirm: async () => {
              await leaveLeaderboard.mutateAsync(lb.id);
              // Select another leaderboard after leaving
              const remaining = leaderboards.filter(l => l.id !== lb.id);
              setSelectedLeaderboardId(remaining[0]?.id);
            },
          });
          break;
      }
    },
    [
      selectedLeaderboard,
      navigation,
      confirm,
      t,
      tCommon,
      showToast,
      setDefault,
      leaveLeaderboard,
      leaderboards,
    ],
  );

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

  // ── Loading state ──────────────────────────────────────────────────────────
  if (lbsLoading) {
    return (
      <ScreenLayout isDark={isDark}>
        <View style={[styles.brandRow, { borderBottomColor: tk.primary[900] }]}>
          <AppLogo />
        </View>
        <LoadingState message={t('loading')} isDark={isDark} />
      </ScreenLayout>
    );
  }

  const hasNoLeaderboards = leaderboards.length === 0;

  return (
    <ScreenLayout isDark={isDark}>
      {/* ── Brand row ───────────────────────────────────────────────────── */}
      <View style={[styles.brandRow, { borderBottomColor: tk.primary[900] }]}>
        <AppLogo />
      </View>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={[styles.header, { borderBottomColor: tk.border.default }]}>
        <Text
          style={[styles.title, { color: tk.text.primary }]}
          numberOfLines={1}
        >
          {hasNoLeaderboards
            ? t('myLeaderboards')
            : (selectedLeaderboard?.name ?? t('myLeaderboards'))}
        </Text>

        {!hasNoLeaderboards && (
          <View style={styles.headerActions}>
            {/* Sliders — switch leaderboard */}
            <Pressable
              onPress={() => setFilterModalOpen(true)}
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && { opacity: 0.5 },
              ]}
              accessibilityRole='button'
              accessibilityLabel={t('filterVisibility')}
            >
              <View style={styles.iconWrap}>
                <Feather
                  name='sliders'
                  size={iconSize.lg}
                  color={
                    activeFilterCount > 0 ? tk.primary[500] : tk.text.muted
                  }
                />
                {activeFilterCount > 0 && (
                  <View
                    style={[
                      styles.filterBadge,
                      { backgroundColor: tk.primary[500] },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterBadgeText,
                        { color: tk.text.onPrimary },
                      ]}
                    >
                      {activeFilterCount}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>

            {/* Three-dot — context menu */}
            <Pressable
              ref={menuBtnRef}
              onPress={() => {
                menuBtnRef.current?.measure(
                  (_fx, _fy, width, height, px, py) => {
                    setMenuAnchor({ x: px, y: py, width, height });
                    setMenuOpen(true);
                  },
                );
              }}
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && { opacity: 0.5 },
              ]}
              accessibilityRole='button'
              accessibilityLabel='More options'
            >
              <Feather
                name='more-vertical'
                size={iconSize.lg}
                color={tk.text.muted}
              />
            </Pressable>
          </View>
        )}
      </View>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      {hasNoLeaderboards ? (
        <ScrollView
          style={styles.emptyScroll}
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingLeaderboards}
              onRefresh={refetchLeaderboards}
              tintColor={tk.primary[400]}
              colors={[tk.primary[400]]}
            />
          }
        >
          <Text style={[styles.emptyTitle, { color: tk.text.primary }]}>
            {t('noLeaderboardsTitle')}
          </Text>
          <Text style={[styles.emptyDesc, { color: tk.text.muted }]}>
            {t('noLeaderboardsDesc')}
          </Text>
          <View style={styles.emptyActions}>
            <SecondaryButton
              label={t('createLeaderboard')}
              isDark={isDark}
              onPress={() => navigation.push('CreateCustomLeaderboard')}
            />
            <PrimaryButton
              label={t('joinLeaderboard')}
              isDark={isDark}
              onPress={() => navigation.push('JoinLeaderboard')}
            />
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => `${item.userId}-${item.rank}`}
          renderItem={renderEntry}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          contentContainerStyle={{
            paddingBottom: verticalScale(40),
            paddingTop: spacing[2],
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !rankingsLoading}
              onRefresh={refetch}
              tintColor={tk.primary[400]}
              colors={[tk.primary[400]]}
            />
          }
          ListEmptyComponent={
            rankingsLoading ? (
              <LoadingState message={t('loading')} isDark={isDark} />
            ) : rankingsError ? (
              <EmptyState
                title={t('loadFailed')}
                description=''
                isDark={isDark}
              />
            ) : (
              <EmptyState
                title={
                  modalFilters.includeProvisional
                    ? t('empty')
                    : t('emptyRatedOnly')
                }
                description={
                  modalFilters.includeProvisional
                    ? t('emptyDesc')
                    : t('emptyRatedOnlyDesc')
                }
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
      )}

      {/* ── FAB — Join Leaderboard ──────────────────────────────────────── */}
      {!hasNoLeaderboards && (
        <View style={styles.fabRow} pointerEvents='box-none'>
          <View style={{ flex: 1 }} />
          <FloatingActionButton
            label={t('joinFab')}
            icon={
              <Feather
                name='bar-chart-2'
                size={iconSize.md}
                color={tk.text.onPrimary}
              />
            }
            onPress={() => navigation.push('JoinLeaderboard')}
            style={{ flex: 1 }}
          />
        </View>
      )}

      {/* ── Context menu ────────────────────────────────────────────────── */}
      <LeaderboardContextMenu
        visible={menuOpen}
        leaderboard={selectedLeaderboard ?? null}
        anchor={menuAnchor}
        isDefault={selectedLeaderboardId === defaultLeaderboardId}
        onAction={handleMenuAction}
        onClose={() => setMenuOpen(false)}
      />

      {/* ── Filter modal (leaderboard switcher) ──────────────────────────── */}
      <LeaderboardFilterModal
        visible={filterModalOpen}
        applied={{ ...modalFilters, selectedLeaderboardId }}
        leaderboards={leaderboards}
        defaultLeaderboardId={defaultLeaderboardId}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleApplyFilters}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  brandRow: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    gap: spacing[3],
  },
  title: {
    flex: 1,
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  iconBtn: {
    padding: spacing[3],
  },
  iconWrap: {
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  filterBadgeText: {
    fontSize: 10,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.bold,
    lineHeight: 12,
  },
  emptyScroll: {
    flex: 1,
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    gap: spacing[3],
  },
  emptyTitle: {
    fontSize: typography.size.xl,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyDesc: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    textAlign: 'center',
    lineHeight: typography.size.sm * 1.6,
  },
  emptyActions: {
    width: '100%',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  footerLoader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
  },
  fabRow: {
    position: 'absolute',
    bottom: spacing[4],
    left: spacing[5],
    right: spacing[5],
    flexDirection: 'row',
    gap: spacing[3],
  },
});

export default LeaderboardScreen;
