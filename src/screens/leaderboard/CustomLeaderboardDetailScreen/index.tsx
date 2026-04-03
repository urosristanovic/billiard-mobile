import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
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
} from '@/features/leaderboard/useCustomLeaderboards';
import { useAuth } from '@/features/auth/useAuth';
import { DangerButton } from '@/components/common/buttons/DangerButton';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import { typography } from '@/constants/theme';
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
  const { deleteLeaderboard, removeMember } = useCustomLeaderboardMutations();
  const [refreshing, setRefreshing] = useState(false);
  const isGroupAttached = !!lb?.groupId;
  const members = isGroupAttached ? groupMembers : customMembers;
  const membersLoading = isGroupAttached
    ? groupMembersLoading
    : customMembersLoading;

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
  if (!lb)
    return (
      <EmptyState
        title='Leaderboard not found'
        description=''
        isDark={isDark}
      />
    );

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
        ? t('customLeaderboards.leaveLeaderboard', {
            defaultValue: 'Leave leaderboard?',
          })
        : t('customLeaderboards.removeMemberConfirmTitle', {
            defaultValue: 'Remove member?',
          }),
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
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: tk.text.muted }]}>
            {t('customLeaderboards.empty')}
          </Text>
        }
        renderItem={({ item: member }) => (
          <MemberRow
            displayName={member.displayName}
            username={member.username}
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
        <View
          style={[detailStyles.bottomActionBar, { borderTopColor: tk.primary[900] }]}
        >
          <PrimaryButton
            isDark={isDark}
            label={`+ ${t('customLeaderboards.addMember')}`}
            onPress={() => navigation.push('UserSearch', { leaderboardId })}
          />
        </View>
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  groupNote: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    lineHeight: Math.round(typography.size.xs * 1.5),
  },
});

export default CustomLeaderboardDetailScreen;
