import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import { useConfirmDialog } from '@/components/common/dialog';
import { useGroupMembers } from '@/features/groups/useGroups';
import {
  useCustomLeaderboardDetail,
  useCustomLeaderboardMembers,
  useCustomLeaderboardMutations,
} from '@/features/leaderboard/useCustomLeaderboards';
import { useAuth } from '@/features/auth/useAuth';
import { typography, spacing, radius } from '@/constants/theme';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<LeaderboardStackParamList, 'CustomLeaderboardDetail'>;

const CustomLeaderboardDetailScreen = ({ route, navigation }: Props) => {
  const { leaderboardId } = route.params;
  const { t } = useTranslation('groups');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { confirm } = useConfirmDialog();
  const { user } = useAuth();

  const { data: lb, isLoading: lbLoading, refetch: refetchLb } = useCustomLeaderboardDetail(leaderboardId);
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
  const { deleteLeaderboard, removeMember } = useCustomLeaderboardMutations();
  const [refreshing, setRefreshing] = useState(false);
  const isGroupAttached = !!lb?.groupId;
  const members = isGroupAttached ? groupMembers : customMembers;
  const membersLoading = isGroupAttached ? groupMembersLoading : customMembersLoading;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchLb(),
      isGroupAttached ? refetchGroupMembers() : refetchCustomMembers(),
    ]);
    setRefreshing(false);
  }, [isGroupAttached, refetchCustomMembers, refetchGroupMembers, refetchLb]);

  if (lbLoading || membersLoading) {
    return (
      <ScreenLayout isDark={isDark}>
        <LoadingState isDark={isDark} />
      </ScreenLayout>
    );
  }
  if (!lb) return <EmptyState title='Leaderboard not found' description='' isDark={isDark} />;

  const isCreator = lb.createdBy === user?.id;
  const hasBottomAddAction = isCreator && !isGroupAttached;

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
        ? t('customLeaderboards.leaveLeaderboard', { defaultValue: 'Leave leaderboard?' })
        : t('customLeaderboards.removeMemberConfirmTitle', { defaultValue: 'Remove member?' }),
      message: isSelf
        ? t('customLeaderboards.leaveLeaderboardConfirmMessage', {
            defaultValue: 'You will be removed from this leaderboard.',
          })
        : t('customLeaderboards.removeMemberConfirmMessage', {
            name: memberName,
            defaultValue: '{{name}} will be removed from this leaderboard.',
          }),
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

  return (
    <ScreenLayout isDark={isDark}>
      <View style={styles.header}>
        <Text
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { color: tk.primary[400] }]}
        >
          ← {tCommon('back')}
        </Text>
        <Text style={[styles.title, { color: tk.text.primary }]} numberOfLines={2}>
          {lb.name}
        </Text>
        {lb.description ? (
          <Text style={[styles.description, { color: tk.text.secondary }]}>
            {lb.description}
          </Text>
        ) : null}
        <Text style={[styles.meta, { color: tk.text.muted }]}>
          {lb.isPublic ? 'Public' : 'Private'} ·{' '}
          {t('customLeaderboards.thresholdLabel')}: {lb.provisionalThreshold} ·{' '}
          {lb.memberCount} members
        </Text>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: tk.text.secondary }]}>
            {t('customLeaderboards.members')}
          </Text>
          {isCreator && (
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.deleteInlineButton, { borderColor: '#ef4444' }]}
            >
              <Text style={[styles.deleteInlineButtonText, { color: '#ef4444' }]}>
                {t('customLeaderboards.delete')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={members}
        keyExtractor={item => item.userId}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          hasBottomAddAction ? styles.listContentWithBottomAction : null,
        ]}
        bounces
        alwaysBounceVertical
        overScrollMode="always"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tk.primary[400]}
            colors={[tk.primary[400]]}
            progressBackgroundColor={tk.background?.primary}
          />
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: tk.text.muted }]}>
            {t('customLeaderboards.empty')}
          </Text>
        }
        renderItem={({ item: member }) => (
          <View style={[styles.memberRow, { borderBottomColor: tk.primary[900] }]}>
            <View style={[styles.memberAvatar, { backgroundColor: tk.primary[900], borderColor: tk.primary[700] }]}>
              <Text style={[styles.memberAvatarText, { color: tk.primary[300] }]}>
                {member.displayName.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={[styles.memberName, { color: tk.text.primary }]}>
                {member.displayName}
              </Text>
              <Text style={[styles.memberUsername, { color: tk.text.muted }]}>
                @{member.username}
              </Text>
            </View>
            {!isGroupAttached && (isCreator || member.userId === user?.id) && (
              <TouchableOpacity onPress={() => handleRemoveMember(member.userId, member.displayName)}>
                <Text style={[styles.removeText, { color: tk.text.muted }]}>
                  {member.userId === user?.id
                    ? t('customLeaderboards.leaveLeaderboard')
                    : t('customLeaderboards.removeMember')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            {isCreator && isGroupAttached && (
              <Text style={[styles.groupNote, { color: tk.text.muted }]}>
                {t('customLeaderboards.groupAttachedNote')}
              </Text>
            )}
          </View>
        }
      />
      {hasBottomAddAction && (
        <View style={[styles.bottomActionBar, { borderTopColor: tk.primary[900] }]}>
          <TouchableOpacity
            onPress={() => navigation.push('UserSearch', { leaderboardId })}
            style={[
              styles.addMemberButton,
              { borderColor: tk.primary[700], backgroundColor: tk.primary[500] },
            ]}
          >
            <Text style={[styles.addMemberButtonText, { color: tk.text.onPrimary }]}>
              + {t('customLeaderboards.addMember')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[2],
    gap: spacing[2],
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  listContentWithBottomAction: {
    paddingBottom: spacing[20],
  },
  backButton: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[2],
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  meta: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing[4],
  },
  sectionTitle: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  deleteInlineButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  deleteInlineButtonText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    gap: spacing[3],
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.heading,
  },
  memberUsername: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    marginTop: 2,
  },
  removeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
  footer: {
    marginTop: spacing[6],
    gap: spacing[3],
  },
  bottomActionBar: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[5],
    borderTopWidth: 1,
  },
  addMemberButton: {
    padding: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  addMemberButtonText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  groupNote: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    lineHeight: Math.round(typography.size.xs * 1.5),
  },
});

export default CustomLeaderboardDetailScreen;
