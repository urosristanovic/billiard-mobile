import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import { useConfirmDialog } from '@/components/common/dialog';
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
  const { isDark, tk } = useTheme();
  const { confirm } = useConfirmDialog();
  const { user } = useAuth();

  const { data: lb, isLoading: lbLoading } = useCustomLeaderboardDetail(leaderboardId);
  const { data: members = [], isLoading: membersLoading } = useCustomLeaderboardMembers(leaderboardId);
  const { deleteLeaderboard, removeMember } = useCustomLeaderboardMutations();

  if (lbLoading || membersLoading) return <LoadingState isDark={isDark} />;
  if (!lb) return <EmptyState title='Leaderboard not found' description='' isDark={isDark} />;

  const isCreator = lb.createdBy === user?.id;

  const handleDelete = () => {
    confirm({
      title: t('customLeaderboards.deleteConfirmTitle'),
      message: t('customLeaderboards.deleteConfirmMessage'),
      confirmLabel: t('customLeaderboards.delete'),
      variant: 'destructive',
      onConfirm: () => deleteLeaderboard.mutate(leaderboardId, {
        onSuccess: () => navigation.goBack(),
      }),
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    removeMember.mutate({ leaderboardId, userId: memberId });
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
            {lb.name}
          </Text>
          <Text style={[styles.meta, { color: tk.text.muted }]}>
            {lb.isPublic ? 'Public' : 'Private'} ·{' '}
            {t('customLeaderboards.thresholdLabel')}: {lb.provisionalThreshold} ·{' '}
            {lb.memberCount} members
          </Text>
        </View>

        {/* Members */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: tk.text.secondary }]}>
              {t('customLeaderboards.members')}
            </Text>
            {isCreator && (
              <TouchableOpacity
                onPress={() => navigation.push('UserSearch')}
                style={[styles.addButton, { borderColor: tk.primary[700] }]}
              >
                <Text style={[styles.addButtonText, { color: tk.primary[400] }]}>
                  + {t('customLeaderboards.addMember')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {members.length === 0 ? (
            <Text style={[styles.emptyText, { color: tk.text.muted }]}>
              {t('customLeaderboards.empty')}
            </Text>
          ) : (
            members.map(member => (
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
                    @{member.username}
                  </Text>
                </View>
                {(isCreator || member.userId === user?.id) && (
                  <TouchableOpacity onPress={() => handleRemoveMember(member.userId)}>
                    <Text style={[styles.removeText, { color: tk.text.muted }]}>
                      {member.userId === user?.id
                        ? t('customLeaderboards.leaveLeaderboard')
                        : t('customLeaderboards.removeMember')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        {/* Danger zone */}
        {isCreator && (
          <View style={styles.dangerZone}>
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.deleteButton, { borderColor: '#ef4444' }]}
            >
              <Text style={[styles.deleteButtonText, { color: '#ef4444' }]}>
                {t('customLeaderboards.delete')}
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

export default CustomLeaderboardDetailScreen;
