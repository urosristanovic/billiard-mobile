import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import { useConfirmDialog } from '@/components/common/dialog';
import {
  useGroupDetail,
  useGroupMembers,
  useGroupMutations,
} from '@/features/groups/useGroups';
import { useAuth } from '@/features/auth/useAuth';
import { DangerButton } from '@/components/common/buttons/DangerButton';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';
import { detailStyles } from '../shared/detailStyles';
import { MemberRow } from '../shared/MemberRow';

type Props = NativeStackScreenProps<LeaderboardStackParamList, 'GroupDetail'>;

const GroupDetailScreen = ({ route, navigation }: Props) => {
  const { groupId } = route.params;
  const { t } = useTranslation('groups');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { confirm } = useConfirmDialog();
  const { user } = useAuth();

  const {
    data: group,
    isLoading: groupLoading,
    refetch: refetchGroup,
  } = useGroupDetail(groupId);
  const {
    data: members = [],
    isLoading: membersLoading,
    refetch: refetchMembers,
  } = useGroupMembers(groupId);
  const { deleteGroup, removeMember } = useGroupMutations();
  const [pendingRemoveUserId, setPendingRemoveUserId] = useState<string | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchGroup(), refetchMembers()]);
    setRefreshing(false);
  }, [refetchGroup, refetchMembers]);

  if (groupLoading || membersLoading) {
    return (
      <ScreenLayout isDark={isDark}>
        <LoadingState isDark={isDark} />
      </ScreenLayout>
    );
  }
  if (!group)
    return (
      <EmptyState title='Group not found' description='' isDark={isDark} />
    );

  const isAdmin = group.myRole === 'admin';
  const isCreator = group.createdBy === user?.id;
  const hasBottomAddAction = isAdmin;

  const handleDelete = () => {
    confirm({
      title: t('groups.deleteConfirmTitle'),
      message: t('groups.deleteConfirmMessage'),
      confirmLabel: tCommon('delete'),
      cancelLabel: tCommon('cancel'),
      variant: 'destructive',
      onConfirm: async () => {
        await deleteGroup.mutateAsync(groupId);
        navigation.goBack();
      },
    });
  };

  const handleRemoveMember = (memberId: string) => {
    const isSelf = memberId === user?.id;
    setPendingRemoveUserId(memberId);
    removeMember.mutate(
      { groupId, userId: memberId },
      {
        onSuccess: () => {
          if (isSelf) {
            navigation.goBack();
          }
        },
        onSettled: () => {
          setPendingRemoveUserId(current =>
            current === memberId ? null : current,
          );
        },
      },
    );
  };

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader onBack={() => navigation.goBack()} title={group.name} />
      <View style={detailStyles.header}>
        {group.description ? (
          <Text
            style={[detailStyles.description, { color: tk.text.secondary }]}
          >
            {group.description}
          </Text>
        ) : null}
        <Text style={[detailStyles.meta, { color: tk.text.muted }]}>
          {group.isPublic ? 'Public' : 'Private'} ·{' '}
          {t('groups.memberCount', { count: group.memberCount })}
        </Text>
        <View style={detailStyles.sectionHeader}>
          <Text
            style={[detailStyles.sectionTitle, { color: tk.text.secondary }]}
          >
            {t('groups.members')}
          </Text>
          {isCreator && (
            <DangerButton
              size='xs'
              isDark={isDark}
              label={t('groups.delete')}
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
        renderItem={({ item: member }) => (
          <MemberRow
            displayName={member.displayName}
            username={member.username}
            subtitle={t(`groups.roles.${member.role}`)}
            isPending={pendingRemoveUserId === member.userId}
            actionLabel={
              member.userId === user?.id
                ? t('groups.leaveGroup')
                : t('groups.removeMember')
            }
            onAction={
              member.userId === user?.id || isAdmin
                ? () => handleRemoveMember(member.userId)
                : undefined
            }
          />
        )}
        ListFooterComponent={<View style={detailStyles.footer} />}
      />
      {hasBottomAddAction && (
        <View
          style={[
            detailStyles.bottomActionBar,
            { borderTopColor: tk.primary[900] },
          ]}
        >
          <PrimaryButton
            isDark={isDark}
            label={`+ ${t('groups.addMember')}`}
            onPress={() => navigation.push('UserSearch', { groupId })}
          />
        </View>
      )}
    </ScreenLayout>
  );
};

export default GroupDetailScreen;
