import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';
import { DISCIPLINE_LABELS, type Match } from '@/types/match';

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
  const totalBeers = (me?.beers ?? 0) + (opponent?.beers ?? 0);
  const isTie =
    me?.score != null && opponent?.score != null && me.score === opponent.score;

  const statusColor: Record<string, string> = {
    challenge_requested: tk.info.default,
    challenge: tk.primary[300],
    pending_confirmation: tk.primary[400],
    confirmed: tk.success.default,
    disputed: tk.error.default,
    cancelled: tk.text.muted,
  };
  const cardAccent =
    match.status === 'challenge_requested'
      ? { borderColor: tk.info.border, borderLeftColor: tk.info.default }
      : match.status === 'challenge'
        ? { borderColor: tk.primary[700], borderLeftColor: tk.primary[300] }
      : match.status === 'cancelled'
      ? { borderColor: tk.text.muted, borderLeftColor: tk.text.muted }
      : match.status === 'pending_confirmation' || match.status === 'disputed'
        ? { borderColor: tk.primary[700], borderLeftColor: tk.primary[400] }
        : isTie
          ? { borderColor: tk.info.border, borderLeftColor: tk.info.default }
          : isWinner
            ? {
                borderColor: tk.rating.trendUp,
                borderLeftColor: tk.rating.trendUp,
              }
            : {
                borderColor: tk.error.border,
                borderLeftColor: tk.error.default,
              };
  const playedAt = new Date(match.playedAt);
  const playedAtText = `${playedAt.toLocaleDateString()} ${playedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  const meName =
    userName || me?.profile.displayName || me?.profile.username || t('you');
  const opponentName =
    opponent?.profile.displayName ||
    opponent?.profile.username ||
    (opponent?.userId ? opponent.userId.slice(0, 8) : '—');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole='button'
      accessibilityLabel={t('detail.vs', {
        replace: { opponentName: opponent?.profile.displayName ?? '—' },
      })}
      style={[
        styles.card,
        {
          backgroundColor: tk.surface.raised,
          ...cardAccent,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.discipline, { color: tk.text.secondary }]}>
          {DISCIPLINE_LABELS[match.discipline]}
        </Text>
        <View style={styles.metaRight}>
          {!match.isRated && (
            <Text style={[styles.unrated, { color: tk.text.muted }]}>
              {t('detail.unrated')}
            </Text>
          )}
          <View
            style={[styles.dot, { backgroundColor: statusColor[match.status] }]}
          />
          <Text
            style={[styles.statusLabel, { color: statusColor[match.status] }]}
          >
            {t(`status.${match.status}`)}
          </Text>
        </View>
      </View>

      <View style={styles.players}>
        <View style={styles.playerCol}>
          <Text
            style={[
              styles.playerName,
              {
                color: isTie
                  ? tk.info.default
                  : isWinner
                    ? tk.primary[600]
                    : tk.text.primary,
              },
            ]}
          >
            {isTie ? `${meName} 🤝` : isWinner ? `${meName} 🏆` : meName}
          </Text>
          {me?.score != null && (
            <Text style={[styles.score, { color: tk.text.primary }]}>
              {me.score}
            </Text>
          )}
        </View>
        <Text style={[styles.vs, { color: tk.primary[300] }]}>
          {t('detail.vs')}
        </Text>
        <View style={[styles.playerCol, styles.playerColRight]}>
          <Text
            style={[
              styles.playerName,
              {
                color: isTie
                  ? tk.info.default
                  : opponent?.isWinner
                    ? tk.error.default
                    : tk.text.primary,
              },
            ]}
          >
            {isTie
              ? t('opponentTie', { name: opponentName })
              : opponent?.isWinner
                ? t('opponentWinner', { name: opponentName })
                : opponentName}
          </Text>
          {opponent?.score != null && (
            <Text style={[styles.score, { color: tk.text.primary }]}>
              {opponent.score}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={[styles.date, { color: tk.text.muted }]}>
          {playedAtText}
        </Text>
        {totalBeers > 0 && (
          <Text style={[styles.beers, { color: tk.text.muted }]}>
            🍺 {me?.beers ?? 0} · {opponent?.beers ?? 0}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderLeftWidth: 4,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discipline: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaRight: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
  unrated: { fontSize: typography.size.xs, marginRight: spacing[1] },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    fontFamily: typography.family.bodySemibold,
    textTransform: 'uppercase',
  },
  players: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  playerCol: { flex: 1, gap: 2 },
  playerColRight: { alignItems: 'flex-end' },
  playerName: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: typography.family.bodySemibold,
  },
  score: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  vs: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: typography.family.display,
    letterSpacing: 0.8,
    width: 24,
    textAlign: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { fontSize: typography.size.xs, fontFamily: typography.family.body },
  beers: { fontSize: typography.size.xs, fontFamily: typography.family.body },
});
