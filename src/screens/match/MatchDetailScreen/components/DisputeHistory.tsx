import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { MatchDispute, MatchPlayer } from '@/types/match';
import { theme, typography, spacing, radius } from '@/constants/theme';

interface DisputeHistoryProps {
  disputes: MatchDispute[];
  players: MatchPlayer[];
  myUserId: string;
  isDark: boolean;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function getScore(
  scores: Record<string, number> | null | undefined,
  userId: string | undefined,
) {
  if (!scores || !userId) return '-';
  const value = scores[userId];
  return typeof value === 'number' ? String(value) : '-';
}

export const DisputeHistory = ({
  disputes,
  players,
  myUserId,
  isDark,
}: DisputeHistoryProps) => {
  const { t } = useTranslation('matches');
  const tk = isDark ? theme.dark : theme.light;

  const myPlayer = players.find(player => player.userId === myUserId) ?? null;
  const opponent =
    players.find(player => player.userId !== myPlayer?.userId) ?? players[0];
  const disputesChronological = [...disputes].reverse();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tk.surface.raised,
          borderColor: tk.border.default,
        },
      ]}
    >
      <Text style={[styles.title, { color: tk.text.primary }]}>
        {t('detail.disputeHistoryTitle')}
      </Text>

      {disputesChronological.map((dispute, index) => {
        const disputer =
          players.find(player => player.userId === dispute.disputedBy) ?? null;
        const disputerName =
          disputer?.userId === myUserId
            ? t('you')
            : (disputer?.profile.displayName ?? t('detail.opponent'));

        const statusColor =
          dispute.status === 'accepted'
            ? tk.success.default
            : dispute.status === 'rejected'
              ? tk.error.default
              : tk.warning.default;
        const statusBg =
          dispute.status === 'accepted'
            ? tk.success.light
            : dispute.status === 'rejected'
              ? tk.error.light
              : tk.warning.light;
        const statusLabel =
          dispute.status === 'accepted'
            ? t('detail.disputeStatusAccepted')
            : dispute.status === 'rejected'
              ? t('detail.disputeStatusRejected')
              : t('detail.disputeStatusOpen');

        return (
          <View
            key={dispute.id}
            style={[
              styles.item,
              index > 0 && {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: tk.border.subtle,
                paddingTop: spacing[3],
              },
            ]}
          >
            <View style={styles.itemHeader}>
              <Text style={[styles.metaText, { color: tk.text.secondary }]}>
                {t('detail.disputedBy', { name: disputerName })}
              </Text>
              <View style={[styles.badge, { backgroundColor: statusBg }]}>
                <Text style={[styles.badgeText, { color: statusColor }]}>
                  {statusLabel}
                </Text>
              </View>
            </View>

            <Text style={[styles.metaText, { color: tk.text.secondary }]}>
              {t('detail.disputedAt', {
                dateTime: formatDateTime(dispute.createdAt),
              })}
            </Text>

            <Text style={[styles.metaText, { color: tk.text.secondary }]}>
              {t('detail.disputeReasonLabel')}:{' '}
              {dispute.reason || t('detail.disputeReasonEmpty')}
            </Text>

            <Text style={[styles.scoreLabel, { color: tk.text.secondary }]}>
              {t('detail.originalScoresLabel')}
            </Text>
            <Text style={[styles.scoreValue, { color: tk.text.primary }]}>
              {t('you')}: {getScore(dispute.originalScores, myPlayer?.userId)} |{' '}
              {opponent?.profile.displayName ?? t('detail.opponent')}:{' '}
              {getScore(dispute.originalScores, opponent?.userId)}
            </Text>

            <Text style={[styles.scoreLabel, { color: tk.text.secondary }]}>
              {t('detail.correctedScoresLabel')}
            </Text>
            <Text style={[styles.scoreValue, { color: tk.text.primary }]}>
              {t('you')}: {getScore(dispute.proposedScores, myPlayer?.userId)} |{' '}
              {opponent?.profile.displayName ?? t('detail.opponent')}:{' '}
              {getScore(dispute.proposedScores, opponent?.userId)}
            </Text>

            {dispute.resolvedAt && (
              <Text style={[styles.metaText, { color: tk.text.secondary }]}>
                {t('detail.resolvedAtLabel', {
                  dateTime: formatDateTime(dispute.resolvedAt),
                })}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  title: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    gap: spacing[1],
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[2],
  },
  metaText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
  badge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  scoreLabel: {
    marginTop: spacing[1],
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
});
