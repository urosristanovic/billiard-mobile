import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  const { data: group, isLoading: groupLoading } = useGroupDetail(groupId);
  const { data: members = [], isLoading: membersLoading } = useGroupMembers(groupId);
  const { deleteGroup, removeMember } = useGroupMutations();

  if (groupLoading || membersLoading) return <LoadingState isDark={isDark} />;
  if (!group) return <EmptyState title='Group not found' description='' isDark={isDark} />;

  const isAdmin = group.myRole === 'admin';
  const isCreator = group.createdBy === user?.id;

  const handleDelete = () => {
    confirm({
      title: t('groups.deleteConfirmTitle'),
      message: t('groups.deleteConfirmMessage'),
      confirmLabel: t('groups.delete'),
      variant: 'destructive',
      onConfirm: () => deleteGroup.mutate(groupId, {
        onSuccess: () => navigation.goBack(),
      }),
    });
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    confirm({
      title: t('groups.removeMemberConfirmTitle'),
      message: t('groups.removeMemberConfirmMessage', { name: memberName }),
      confirmLabel: t('groups.removeMember'),
      variant: 'destructive',
      onConfirm: () => removeMember.mutate({ groupId, userId: memberId }),
    });
  };

  return (
    <ScreenLayout isDark={isDark}>
      <ScrollView contentContainerStyle={styles.container}>
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
        </View>

        {/* Members section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: tk.text.secondary }]}>
              {t('groups.members')}
            </Text>
            {isAdmin && (
              <TouchableOpacity
                onPress={() => navigation.push('UserSearch')}
                style={[styles.addButton, { borderColor: tk.primary[700] }]}
              >
                <Text style={[styles.addButtonText, { color: tk.primary[400] }]}>
                  + {t('groups.addMember')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {members.map(member => (
            <View
              key={member.userId}
              style={[styles.memberRow, { borderBottomColor: tk.primary[900] }]}
            >
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
              {isAdmin && member.userId !== user?.id && (
                <TouchableOpacity onPress={() => handleRemoveMember(member.userId, member.displayName)}>
                  <Text style={[styles.removeText, { color: tk.text.muted }]}>
                    {t('groups.removeMember')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Danger zone */}
        {isCreator && (
          <View style={styles.dangerZone}>
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.deleteButton, { borderColor: '#ef4444' }]}
            >
              <Text style={[styles.deleteButtonText, { color: '#ef4444' }]}>
                {t('groups.delete')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing[8],
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
    gap: spacing[2],
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
  section: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  addButtonText: {
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
  dangerZone: {
    marginHorizontal: spacing[4],
    marginTop: spacing[8],
  },
  deleteButton: {
    padding: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default GroupDetailScreen;
