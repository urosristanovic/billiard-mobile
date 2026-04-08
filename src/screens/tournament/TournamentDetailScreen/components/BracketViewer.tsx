import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { theme, typography, spacing, radius } from '@/constants/theme';
import { scale } from '@/utils/scale';
import type { TournamentMatch, TournamentRound } from '@/types/tournament';

interface BracketMatchCardProps {
  match: TournamentMatch;
  isDark: boolean;
  interactive?: boolean;
  recordResultLabel?: string;
  editResultLabel?: string;
  waitingLabel?: string;
  onPress?: () => void;
}

const BracketMatchCard = ({
  match,
  isDark,
  interactive = false,
  recordResultLabel,
  editResultLabel,
  waitingLabel,
  onPress,
}: BracketMatchCardProps) => {
  const tk = isDark ? theme.dark : theme.light;

  const homeName =
    match.homeProfile?.displayName || match.homeProfile?.username || 'TBD';
  const awayName =
    match.awayProfile?.displayName || match.awayProfile?.username || 'TBD';

  const bothTBD = homeName === 'TBD' && awayName === 'TBD';
  const homeWon = match.winnerId === match.homeUserId;
  const awayWon = match.winnerId === match.awayUserId;

  const card = (
    <View
      style={[
        styles.matchCard,
        { backgroundColor: tk.surface.default, borderColor: tk.border.default },
        interactive && {
          borderColor: tk.primary[500],
          borderWidth: 1,
        },
      ]}
    >
      {bothTBD ? (
        <View style={styles.waitingContainer}>
          <Text style={[styles.waitingText, { color: tk.text.muted }]}>
            {waitingLabel}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.matchRow}>
            <Text
              style={[
                styles.playerName,
                {
                  color: homeWon
                    ? tk.primary[500]
                    : match.winnerId
                      ? tk.text.muted
                      : tk.text.primary,
                },
              ]}
              numberOfLines={1}
            >
              {homeName}
            </Text>
            {match.homeScore !== null && (
              <Text
                style={[
                  styles.scoreText,
                  { color: homeWon ? tk.primary[600] : tk.text.primary },
                ]}
              >
                {match.homeScore}
              </Text>
            )}
          </View>
          <View
            style={[styles.divider, { backgroundColor: tk.border.subtle }]}
          />
          <View style={styles.matchRow}>
            <Text
              style={[
                styles.playerName,
                {
                  color: awayWon
                    ? tk.primary[500]
                    : match.winnerId
                      ? tk.text.muted
                      : tk.text.primary,
                },
              ]}
              numberOfLines={1}
            >
              {awayName}
            </Text>
            {match.awayScore !== null && (
              <Text
                style={[
                  styles.scoreText,
                  { color: awayWon ? tk.primary[600] : tk.text.primary },
                ]}
              >
                {match.awayScore}
              </Text>
            )}
          </View>
        </>
      )}
      {interactive ? (
        <>
          <View
            style={[styles.divider, { backgroundColor: tk.border.subtle }]}
          />
          <Text style={[styles.interactionHint, { color: tk.primary[400] }]}>
            {match.winnerId && editResultLabel
              ? editResultLabel
              : recordResultLabel}
          </Text>
        </>
      ) : null}
    </View>
  );

  if (interactive && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {card}
      </TouchableOpacity>
    );
  }

  return card;
};

interface BracketViewerProps {
  rounds: TournamentRound[];
  matches: TournamentMatch[];
  isDark?: boolean;
  onMatchPress?: (match: TournamentMatch) => void;
  canInteract?: (match: TournamentMatch) => boolean;
  recordResultLabel?: string;
  editResultLabel?: string;
  waitingLabel?: string;
}

export const BracketViewer = ({
  rounds,
  matches,
  isDark = false,
  onMatchPress,
  canInteract,
  recordResultLabel,
  editResultLabel,
  waitingLabel,
}: BracketViewerProps) => {
  const tk = isDark ? theme.dark : theme.light;

  const sortedRounds = [...rounds].sort((a, b) => {
    // winners first, then losers, then grand final
    const order = { winners: 0, main: 0, losers: 1, grand_final: 2 };
    const typeDiff = (order[a.bracketType] ?? 0) - (order[b.bracketType] ?? 0);
    if (typeDiff !== 0) return typeDiff;
    return a.roundNumber - b.roundNumber;
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.bracket}>
        {sortedRounds.map(round => {
          const roundMatches = matches
            .filter(m => m.roundId === round.id)
            .sort((a, b) => a.position - b.position);

          const label =
            round.bracketType === 'grand_final'
              ? 'Grand Final'
              : round.bracketType === 'losers'
                ? `Losers R${round.roundNumber}`
                : `Round ${round.roundNumber}`;

          return (
            <View key={round.id} style={styles.roundColumn}>
              <Text style={[styles.roundLabel, { color: tk.text.muted }]}>
                {label}
              </Text>
              <View style={styles.matchList}>
                {roundMatches.map(match => (
                  <BracketMatchCard
                    key={match.id}
                    match={match}
                    isDark={isDark}
                    interactive={canInteract?.(match) ?? false}
                    onPress={
                      onMatchPress ? () => onMatchPress(match) : undefined
                    }
                    recordResultLabel={recordResultLabel}
                    editResultLabel={editResultLabel}
                    waitingLabel={waitingLabel}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bracket: {
    flexDirection: 'row',
    gap: spacing[4],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  roundColumn: {
    width: scale(140),
    gap: spacing[2],
  },
  roundLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingBottom: spacing[1],
  },
  matchList: {
    gap: spacing[3],
  },
  matchCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  waitingContainer: {
    paddingVertical: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[1],
  },
  playerName: {
    flex: 1,
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
  scoreText: {
    fontSize: typography.size.lg,
    fontFamily: typography.family.heading,
    minWidth: scale(12),
    textAlign: 'right',
  },
  divider: {
    height: 1,
  },
  interactionHint: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    textAlign: 'center',
    paddingVertical: spacing[1],
    textTransform: 'uppercase',
  },
});
