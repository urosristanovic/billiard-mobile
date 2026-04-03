import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';
import { type Match } from '@/types/match';
import { MatchStatusBadge } from '@/components/common/MatchStatusBadge';

interface MatchCardProps {
  match: Match;
  userId: string;
  userName?: string;
  onPress: () => void;
  isDark: boolean;
}

export const MatchCard = ({
  match,
  userId,
  userName,
  onPress,
  isDark,
}: MatchCardProps) => {
  const { t } = useTranslation('matches');
  const tk = isDark ? theme.dark : theme.light;

  const me = match.players.find(p => p.userId === userId);
  const opponent = match.players.find(p => p.userId !== userId);
  const isWinner = me?.isWinner;
  const isTie =
    me?.score != null && opponent?.score != null && me.score === opponent.score;

  const playedAt = new Date(match.playedAt);
  const dateStr = playedAt.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
  const timeStr = playedAt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const meName =
    userName || me?.profile.displayName || me?.profile.username || t('you');
  const opponentName =
    opponent?.profile.displayName ||
    opponent?.profile.username ||
    (opponent?.userId ? opponent.userId.slice(0, 8) : '—');

  const meInitials = meName.slice(0, 2).toUpperCase();
  const opponentInitials = opponentName.slice(0, 2).toUpperCase();

  const meNameColor = isTie
    ? tk.info.default
    : isWinner
      ? tk.text.primary
      : tk.text.secondary;
  const oppNameColor = isTie
    ? tk.info.default
    : opponent?.isWinner
      ? tk.text.primary
      : tk.text.secondary;
  const meScoreColor = isTie
    ? tk.info.default
    : isWinner
      ? tk.primary[500]
      : tk.text.muted;
  const oppScoreColor = isTie
    ? tk.info.default
    : opponent?.isWinner
      ? tk.primary[500]
      : tk.text.muted;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole='button'
      accessibilityLabel={t('detail.vs', {
        replace: { opponentName: opponent?.profile.displayName ?? '—' },
      })}
      style={[
        styles.card,
        {
          backgroundColor: tk.surface.default,
          borderColor: tk.border.default,
        },
      ]}
    >
      {/* ── I switched the positions, so naming is not correct ── */}
      {/* ── Right: two player rows ──────────────────────────── */}
      <View style={styles.rightCol}>
        {/* Me */}
        <View style={styles.playerRow}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: `${tk.primary[400]}20`,
                borderColor: tk.border.strong,
              },
            ]}
          >
            <Text style={[styles.avatarText, { color: tk.primary[500] }]}>
              {meInitials}
            </Text>
          </View>
          <Text
            style={[styles.playerName, { color: meNameColor }]}
            numberOfLines={1}
          >
            {meName}
          </Text>
          <Text style={[styles.playerScore, { color: meScoreColor }]}>
            {me?.score ?? '—'}
          </Text>
        </View>

        <View
          style={[styles.rowDivider, { backgroundColor: tk.border.subtle }]}
        />

        {/* Opponent */}
        <View style={styles.playerRow}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: tk.background.secondary,
                borderColor: tk.border.strong,
              },
            ]}
          >
            <Text style={[styles.avatarText, { color: tk.text.secondary }]}>
              {opponentInitials}
            </Text>
          </View>
          <Text
            style={[styles.playerName, { color: oppNameColor }]}
            numberOfLines={1}
          >
            {opponentName}
          </Text>
          <Text style={[styles.playerScore, { color: oppScoreColor }]}>
            {opponent?.score ?? '—'}
          </Text>
        </View>
      </View>

      {/* ── Left: status / date column ─────────────────────── */}
      <View style={[styles.leftCol, { borderLeftColor: tk.border.default }]}>
        <MatchStatusBadge status={match.status} />

        <Text style={[styles.timeText, { color: tk.text.muted }]}>
          {dateStr}
        </Text>
        <Text style={[styles.timeText, { color: tk.text.muted }]}>
          {timeStr}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: radius['2xl'],
    borderWidth: 1,
    paddingVertical: spacing[4],
    paddingLeft: spacing[4],
  },

  // ── Left column ──────────────────────────────────────────
  leftCol: {
    width: spacing[24],
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    marginLeft: spacing[3],
    gap: spacing[1],
  },
  timeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    textAlign: 'center',
    lineHeight: 14,
  },

  // ── Right column ─────────────────────────────────────────
  rightCol: {
    flex: 1,
    gap: spacing[3],
    justifyContent: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  avatar: {
    width: spacing[8],
    height: spacing[8],
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
  },
  playerName: {
    flex: 1,
    fontSize: typography.size.lg,
    fontFamily: typography.family.bodyMedium,
    fontWeight: typography.weight.medium,
  },
  playerScore: {
    fontSize: typography.size['2xl'],
    fontFamily: typography.family.bodyBold,
    fontWeight: typography.weight.bold,
  },
  rowDivider: {
    height: 1,
    marginVertical: -spacing[1],
  },
});
