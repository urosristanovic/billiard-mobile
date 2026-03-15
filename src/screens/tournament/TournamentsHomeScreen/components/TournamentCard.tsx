import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';
import type { TournamentSummary } from '@/types/tournament';
import { TOURNAMENT_FORMAT_LABELS, TOURNAMENT_STATUS_LABELS } from '@/types/tournament';
import { DISCIPLINE_LABELS } from '@/types/match';

interface TournamentCardProps {
  tournament: TournamentSummary;
  onPress: () => void;
  isDark?: boolean;
}

export const TournamentCard = ({
  tournament,
  onPress,
  isDark = false,
}: TournamentCardProps) => {
  const { t } = useTranslation('tournaments');
  const tk = isDark ? theme.dark : theme.light;

  const nextMatch = tournament.nextMatchInfo;
  const opponentName =
    nextMatch?.opponentProfile?.displayName ||
    nextMatch?.opponentProfile?.username;
  const isWinnerCard = tournament.status === 'completed' && tournament.didWin;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole='button'
      style={[
        styles.card,
        {
          backgroundColor: tk.surface.raised,
          borderColor: isWinnerCard ? tk.primary[600] : tk.border.default,
        },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[styles.name, { color: tk.text.primary }]}
          numberOfLines={1}
        >
          {tournament.name}
        </Text>
        <Text
          style={[
            styles.status,
            { color: isWinnerCard ? tk.primary[300] : tk.primary[400] },
          ]}
        >
          {isWinnerCard
            ? `🏆 ${t('home.past.winnerBadge')}`
            : TOURNAMENT_STATUS_LABELS[tournament.status]}
        </Text>
      </View>

      <View style={styles.meta}>
        <Text style={[styles.metaItem, { color: tk.text.secondary }]}>
          {DISCIPLINE_LABELS[tournament.discipline]}
        </Text>
        <Text style={[styles.dot, { color: tk.text.muted }]}>·</Text>
        <Text style={[styles.metaItem, { color: tk.text.secondary }]}>
          {TOURNAMENT_FORMAT_LABELS[tournament.format]}
        </Text>
        <Text style={[styles.dot, { color: tk.text.muted }]}>·</Text>
        <Text style={[styles.metaItem, { color: tk.text.secondary }]}>
          {tournament.participantCount}/{tournament.maxParticipants}
        </Text>
      </View>

      {tournament.status === 'in_progress' && (
        <Text
          style={[styles.nextMatch, { color: tk.primary[300] }]}
          numberOfLines={1}
        >
          {nextMatch?.state === 'waiting_opponent'
            ? t('home.waitingOpponent')
            : opponentName
            ? t('home.nextMatch', { opponent: opponentName })
            : t('home.noNextMatch')}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[1],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  name: {
    flex: 1,
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  status: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[1],
  },
  metaItem: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  dot: {
    fontSize: typography.size.sm,
  },
  nextMatch: {
    marginTop: spacing[1],
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
});
