import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import { useConfirmDialog } from '@/components/common/dialog';
import { useGroupMembers } from '@/features/groups/useGroups';
import {
  useCustomLeaderboardDetail,
  useCustomLeaderboardMembers,
  useCustomLeaderboardMutations,
  usePendingMembers,
  useRespondToPending,
} from '@/features/leaderboard/useCustomLeaderboards';
import { useAuth } from '@/features/auth/useAuth';
import { Feather } from '@expo/vector-icons';
import { DangerButton } from '@/components/common/buttons/DangerButton';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import { FloatingActionButton } from '@/components/common/buttons/FloatingActionButton';
import { typography, spacing, iconSize, radius } from '@/constants/theme';
import { scale } from '@/utils/scale';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';
import { detailStyles } from '../shared/detailStyles';
import { MemberRow } from '../shared/MemberRow';

type Props = NativeStackScreenProps<
  LeaderboardStackParamList,
  'CustomLeaderboardDetail'
>;

const CustomLeaderboardDetailScreen = ({ route, navigation }: Props) => {
  const { leaderboardId } = route.params;
  const { t } = useTranslation('groups');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { confirm } = useConfirmDialog();
  const { user } = useAuth();

  const {
    data: lb,
    isLoading: lbLoading,
    refetch: refetchLb,
  } = useCustomLeaderboardDetail(leaderboardId);

  const {
    data: customMembers = [],
    isLoading: customMembersLoading,
    refetch: refetchCustomMembers,
  } = useCustomLeaderboardMembers(leaderboardId);

  const {
    data: groupMembers = [],
    isLoading: groupMembersLoading,
    refetch: refetchGroupMembers,
  } = useGroupMembers(lb?.groupId ?? '');

  // Pending requests — only relevant for private, non-group leaderboards owned by the viewer
  const isPrivateStandalone = lb ? !lb.isPublic && !lb.groupId : false;
  const isCreatorEarly = lb?.createdBy === user?.id;
  const {
    data: pendingMembers = [],
    refetch: refetchPending,
  } = usePendingMembers(isPrivateStandalone && isCreatorEarly ? leaderboardId : '');

  const { deleteLeaderboard, removeMember } = useCustomLeaderboardMutations();
  const respondToPending = useRespondToPending();

  const [refreshing, setRefreshing] = useState(false);
  const isGroupAttached = !!lb?.groupId;
  const members = isGroupAttached ? groupMembers : customMembers;
  const membersLoading = isGroupAttached ? groupMembersLoading : customMembersLoading;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchLb(),
      isGroupAttached ? refetchGroupMembers() : refetchCustomMembers(),
      isPrivateStandalone ? refetchPending() : Promise.resolve(),
    ]);
    setRefreshing(false);
  }, [
    isGroupAttached,
    isPrivateStandalone,
    refetchCustomMembers,
    refetchGroupMembers,
    refetchLb,
    refetchPending,
  ]);

  if (lbLoading || membersLoading) {
    return (
      <ScreenLayout isDark={isDark}>
        <LoadingState isDark={isDark} />
      </ScreenLayout>
    );
  }
  if (!lb)
    return (
      <EmptyState title='Leaderboard not found' description='' isDark={isDark} />
    );

  const isCreator = lb.createdBy === user?.id;
  const hasBottomAddAction = isCreator && !isGroupAttached;
  const hasPending = isPrivateStandalone && isCreator && pendingMembers.length > 0;

  const handleDelete = () => {
    confirm({
      title: t('customLeaderboards.deleteConfirmTitle'),
      message: t('customLeaderboards.deleteConfirmMessage'),
      confirmLabel: tCommon('delete'),
      cancelLabel: tCommon('cancel'),
      variant: 'destructive',
      onConfirm: async () => {
        await deleteLeaderboard.mutateAsync(leaderboardId);
        navigation.goBack();
      },
    });
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    const isSelf = memberId === user?.id;
    confirm({
      title: isSelf
        ? t('customLeaderboards.leaveLeaderboardConfirmTitle')
        : t('customLeaderboards.removeMemberConfirmTitle'),
      message: isSelf
        ? t('customLeaderboards.leaveLeaderboardConfirmMessage')
        : t('customLeaderboards.removeMemberConfirmMessage', { name: memberName }),
      confirmLabel: isSelf
        ? t('customLeaderboards.leaveLeaderboard')
        : t('customLeaderboards.removeMember'),
      cancelLabel: tCommon('cancel'),
      variant: 'destructive',
      onConfirm: async () => {
        await removeMember.mutateAsync({ leaderboardId, userId: memberId });
      },
    });
  };

  const handleRespond = (userId: string, action: 'accept' | 'decline') => {
    respondToPending.mutate({ leaderboardId, userId, action });
  };

  // ── Pending section rendered as ListHeaderComponent ─────────────────────────
  const PendingSection = hasPending ? (
    <View style={styles.pendingSection}>
      <View style={[styles.pendingSectionHeader, { borderBottomColor: tk.border.subtle }]}>
        <Text style={[styles.pendingSectionTitle, { color: tk.text.secondary }]}>
          {t('customLeaderboards.pendingRequests')}
        </Text>
        <View style={[styles.pendingBadge, { backgroundColor: tk.primary[600] }]}>
          <Text style={[styles.pendingBadgeText, { color: tk.text.onPrimary }]}>
            {pendingMembers.length}
          </Text>
        </View>
      </View>

      {pendingMembers.map(member => {
        const isResponding =
          respondToPending.isPending &&
          respondToPending.variables?.userId === member.userId;

        return (
          <View
            key={member.userId}
            style={[styles.pendingRow, { borderBottomColor: tk.border.subtle }]}
          >
            <View
              style={[
                detailStyles.memberAvatar,
                { backgroundColor: tk.primary[900], borderColor: tk.primary[700] },
              ]}
            >
              <Text style={[detailStyles.memberAvatarText, { color: tk.primary[300] }]}>
                {member.displayName.slice(0, 2).toUpperCase()}
              </Text>
            </View>

            <View style={detailStyles.memberInfo}>
              <Text style={[detailStyles.memberName, { color: tk.text.primary }]}>
                {member.displayName}
              </Text>
              <Text style={[detailStyles.memberUsername, { color: tk.text.muted }]}>
                @{member.username}
              </Text>
            </View>

            {isResponding ? (
              <ActivityIndicator size='small' color={tk.primary[400]} />
            ) : (
              <View style={styles.pendingActions}>
                <PrimaryButton
                  size='xs'
                  isDark={isDark}
                  label={t('customLeaderboards.accept')}
                  onPress={() => handleRespond(member.userId, 'accept')}
                />
                <DangerButton
                  size='xs'
                  isDark={isDark}
                  label={t('customLeaderboards.decline')}
                  onPress={() => handleRespond(member.userId, 'decline')}
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  ) : null;

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader onBack={() => navigation.goBack()} title={lb.name} />

      <View style={detailStyles.header}>
        {lb.description ? (
          <Text style={[detailStyles.description, { color: tk.text.secondary }]}>
            {lb.description}
          </Text>
        ) : null}
        <Text style={[detailStyles.meta, { color: tk.text.muted }]}>
          {lb.isPublic ? 'Public' : 'Private'} ·{' '}
          {t('customLeaderboards.thresholdLabel')}: {lb.provisionalThreshold} ·{' '}
          {t('customLeaderboards.memberCount', { count: lb.memberCount })}
        </Text>
        <View style={detailStyles.sectionHeader}>
          <Text style={[detailStyles.sectionTitle, { color: tk.text.secondary }]}>
            {t('customLeaderboards.members')}
          </Text>
          {isCreator && (
            <DangerButton
              size='xs'
              isDark={isDark}
              label={t('customLeaderboards.delete')}
              onPress={handleDelete}
            />
          )}
        </View>
      </View>

      <FlatList
        data={members}
        keyExtractor={item => item.userId}
        style={detailStyles.list}
        contentContainerStyle={[
          detailStyles.listContent,
          hasBottomAddAction ? detailStyles.listContentWithBottomAction : null,
        ]}
        bounces
        alwaysBounceVertical
        overScrollMode='always'
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tk.primary[400]}
            colors={[tk.primary[400]]}
            progressBackgroundColor={tk.background?.primary}
          />
        }
        ListHeaderComponent={PendingSection}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: tk.text.muted }]}>
            {t('customLeaderboards.empty')}
          </Text>
        }
        renderItem={({ item: member }) => (
          <MemberRow
            displayName={member.displayName}
            username={member.username}
            isAdmin={member.userId === lb.createdBy}
            actionLabel={
              !isGroupAttached && (isCreator || member.userId === user?.id)
                ? member.userId === user?.id
                  ? t('customLeaderboards.leaveLeaderboard')
                  : t('customLeaderboards.removeMember')
                : undefined
            }
            onAction={
              !isGroupAttached && (isCreator || member.userId === user?.id)
                ? () => handleRemoveMember(member.userId, member.displayName)
                : undefined
            }
          />
        )}
        ListFooterComponent={
          <View style={detailStyles.footer}>
            {isCreator && isGroupAttached && (
              <Text style={[styles.groupNote, { color: tk.text.muted }]}>
                {t('customLeaderboards.groupAttachedNote')}
              </Text>
            )}
          </View>
        }
      />

      {hasBottomAddAction && (
        <View style={styles.fabRow} pointerEvents='box-none'>
          <View style={{ flex: 1 }} />
          <FloatingActionButton
            label={t('customLeaderboards.addMember')}
            icon={
              <Feather
                name='user-plus'
                size={iconSize.md}
                color={tk.text.onPrimary}
              />
            }
            onPress={() => navigation.push('UserSearch', { leaderboardId })}
            style={{ flex: 1 }}
          />
        </View>
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  fabRow: {
    position: 'absolute',
    bottom: spacing[4],
    left: spacing[5],
    right: spacing[5],
    flexDirection: 'row',
    gap: spacing[3],
  },
  emptyText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  groupNote: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    lineHeight: Math.round(typography.size.xs * 1.5),
  },
  pendingSection: {
    marginBottom: spacing[4],
  },
  pendingSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingBottom: spacing[2],
    marginBottom: spacing[1],
    borderBottomWidth: 1,
  },
  pendingSectionTitle: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pendingBadge: {
    minWidth: scale(18),
    height: scale(18),
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[1],
  },
  pendingBadgeText: {
    fontSize: 10,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.bold,
    lineHeight: 12,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    gap: spacing[3],
  },
  pendingActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
});

export default CustomLeaderboardDetailScreen;
