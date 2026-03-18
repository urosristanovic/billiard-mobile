import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import { useConfirmDialog } from '@/components/common/dialog';
import { useGroupDetail, useGroupMembers, useGroupMutations } from '@/features/groups/useGroups';
import { useAuth } from '@/features/auth/useAuth';
import { typography, spacing, radius } from '@/constants/theme';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<LeaderboardStackParamList, 'GroupDetail'>;

const GroupDetailScreen = ({ route, navigation }: Props) => {
  const { groupId } = route.params;
  const { t } = useTranslation('groups');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();
  const { confirm } = useConfirmDialog();
  const { user } = useAuth();

  const { data: group, isLoading: groupLoading, refetch: refetchGroup } = useGroupDetail(groupId);
  const { data: members = [], isLoading: membersLoading, refetch: refetchMembers } = useGroupMembers(groupId);
  const { deleteGroup, removeMember } = useGroupMutations();
  const [pendingRemoveUserId, setPendingRemoveUserId] = useState<string | null>(null);
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
  if (!group) return <EmptyState title='Group not found' description='' isDark={isDark} />;

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
          setPendingRemoveUserId(current => (current === memberId ? null : current));
        },
      },
    );
  };

  return (
    <ScreenLayout isDark={isDark}>
      <View style={styles.header}>
        <Text
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { color: tk.primary[400] }]}
        >
          ← Back
        </Text>
        <Text style={[styles.title, { color: tk.text.primary }]} numberOfLines={2}>
          {group.name}
        </Text>
        {group.description ? (
          <Text style={[styles.description, { color: tk.text.secondary }]}>
            {group.description}
          </Text>
        ) : null}
        <Text style={[styles.meta, { color: tk.text.muted }]}>
          {group.isPublic ? 'Public' : 'Private'} ·{' '}
          {t('groups.memberCount', { count: group.memberCount })}
        </Text>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: tk.text.secondary }]}>
            {t('groups.members')}
          </Text>
          {isCreator && (
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.deleteInlineButton, { borderColor: '#ef4444' }]}
            >
              <Text style={[styles.deleteInlineButtonText, { color: '#ef4444' }]}>
                {t('groups.delete')}
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
                @{member.username} · {t(`groups.roles.${member.role}`)}
              </Text>
            </View>
            {(member.userId === user?.id || isAdmin) && (
              <TouchableOpacity
                onPress={() => handleRemoveMember(member.userId)}
                disabled={pendingRemoveUserId === member.userId}
                style={styles.removeButton}
              >
                {pendingRemoveUserId === member.userId ? (
                  <ActivityIndicator size='small' color={tk.text.muted} />
                ) : (
                  <Text style={[styles.removeText, { color: tk.text.muted }]}>
                    {member.userId === user?.id ? t('groups.leaveGroup') : t('groups.removeMember')}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer} />
        }
      />
      {hasBottomAddAction && (
        <View style={[styles.bottomActionBar, { borderTopColor: tk.primary[900] }]}>
          <TouchableOpacity
            onPress={() => navigation.push('UserSearch', { groupId })}
            style={[
              styles.addMemberButton,
              { borderColor: tk.primary[700], backgroundColor: tk.primary[500] },
            ]}
          >
            <Text style={[styles.addMemberButtonText, { color: tk.text.onPrimary }]}>
              + {t('groups.addMember')}
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
  removeButton: {
    minWidth: 60,
    alignItems: 'flex-end',
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
});

export default GroupDetailScreen;
