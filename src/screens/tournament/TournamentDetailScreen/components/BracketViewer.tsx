import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { theme, typography, spacing, radius } from '@/constants/theme';
import type { TournamentMatch, TournamentRound } from '@/types/tournament';

interface BracketMatchCardProps {
  match: TournamentMatch;
  isDark: boolean;
}

const BracketMatchCard = ({ match, isDark }: BracketMatchCardProps) => {
  const tk = isDark ? theme.dark : theme.light;

  const homeName =
    match.homeProfile?.displayName || match.homeProfile?.username || 'TBD';
  const awayName =
    match.awayProfile?.displayName || match.awayProfile?.username || 'TBD';

  const homeWon = match.winnerId === match.homeUserId;
  const awayWon = match.winnerId === match.awayUserId;

  return (
    <View
      style={[
        styles.matchCard,
        { backgroundColor: tk.surface.raised, borderColor: tk.border.default },
      ]}
    >
      <View
        style={[
          styles.matchRow,
          homeWon && { backgroundColor: tk.primary[900] + '44' },
        ]}
      >
        <Text
          style={[
            styles.playerName,
            {
              color: homeWon
                ? tk.primary[300]
                : match.winnerId
                  ? tk.text.muted
                  : tk.text.primary,
            },
          ]}
          numberOfLines={1}
        >
          {homeName}
        </Text>
        {homeWon && <Text style={[styles.trophy, { color: tk.primary[400] }]}>★</Text>}
      </View>
      <View style={[styles.divider, { backgroundColor: tk.border.subtle }]} />
      <View
        style={[
          styles.matchRow,
          awayWon && { backgroundColor: tk.primary[900] + '44' },
        ]}
      >
        <Text
          style={[
            styles.playerName,
            {
              color: awayWon
                ? tk.primary[300]
                : match.winnerId
                  ? tk.text.muted
                  : tk.text.primary,
            },
          ]}
          numberOfLines={1}
        >
          {awayName}
        </Text>
        {awayWon && <Text style={[styles.trophy, { color: tk.primary[400] }]}>★</Text>}
      </View>
    </View>
  );
};

interface BracketViewerProps {
  rounds: TournamentRound[];
  matches: TournamentMatch[];
  isDark?: boolean;
}

export const BracketViewer = ({
  rounds,
  matches,
  isDark = false,
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
    width: 140,
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
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    gap: spacing[1],
  },
  playerName: {
    flex: 1,
    fontSize: typography.size.xs,
    fontFamily: typography.family.bodyMedium,
  },
  trophy: {
    fontSize: 10,
  },
  divider: {
    height: 1,
  },
});
