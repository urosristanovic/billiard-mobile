import { Text, View, StyleSheet } from 'react-native';
import { theme, typography, spacing } from '@/constants/theme';
import type { TournamentMatch, TournamentParticipant } from '@/types/tournament';

interface StandingsRow {
  userId: string;
  displayName: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
}

function buildStandings(
  matches: TournamentMatch[],
  participants: TournamentParticipant[],
): StandingsRow[] {
  const profileMap = new Map(
    participants.map(p => [
      p.userId,
      p.profile.displayName || p.profile.username,
    ]),
  );

  const stats: Record<string, StandingsRow> = {};
  for (const match of matches) {
    if (!match.winnerId || !match.homeUserId || !match.awayUserId) continue;
    const loserId =
      match.homeUserId === match.winnerId
        ? match.awayUserId
        : match.homeUserId;

    for (const uid of [match.homeUserId, match.awayUserId]) {
      if (!stats[uid]) {
        stats[uid] = {
          userId: uid,
          displayName: profileMap.get(uid) ?? uid,
          played: 0,
          wins: 0,
          losses: 0,
          points: 0,
        };
      }
    }

    stats[match.winnerId].wins++;
    stats[match.winnerId].played++;
    stats[match.winnerId].points += 3;
    stats[loserId].losses++;
    stats[loserId].played++;
  }

  return Object.values(stats).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });
}

interface StandingsTableProps {
  matches: TournamentMatch[];
  participants: TournamentParticipant[];
  isDark?: boolean;
}

export const StandingsTable = ({
  matches,
  participants,
  isDark = false,
}: StandingsTableProps) => {
  const tk = isDark ? theme.dark : theme.light;
  const rows = buildStandings(matches, participants);

  if (rows.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Table header */}
      <View style={[styles.row, styles.headerRow, { borderBottomColor: tk.border.default }]}>
        <Text style={[styles.rank, { color: tk.text.muted }]}>#</Text>
        <Text style={[styles.name, { color: tk.text.muted }]}>Player</Text>
        <Text style={[styles.cell, { color: tk.text.muted }]}>W</Text>
        <Text style={[styles.cell, { color: tk.text.muted }]}>L</Text>
        <Text style={[styles.cell, { color: tk.primary[400] }]}>Pts</Text>
      </View>

      {rows.map((row, idx) => (
        <View
          key={row.userId}
          style={[
            styles.row,
            { borderBottomColor: tk.border.subtle },
            idx === 0 && { backgroundColor: tk.primary[900] + '33' },
          ]}
        >
          <Text style={[styles.rank, { color: tk.text.muted }]}>
            {idx + 1}
          </Text>
          <Text
            style={[styles.name, { color: tk.text.primary }]}
            numberOfLines={1}
          >
            {row.displayName}
          </Text>
          <Text style={[styles.cell, { color: tk.text.secondary }]}>
            {row.wins}
          </Text>
          <Text style={[styles.cell, { color: tk.text.secondary }]}>
            {row.losses}
          </Text>
          <Text style={[styles.cell, { color: tk.primary[400] }]}>
            {row.points}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    borderBottomWidth: 1,
    gap: spacing[2],
  },
  headerRow: {
    borderBottomWidth: 1,
  },
  rank: {
    width: 24,
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textAlign: 'center',
  },
  name: {
    flex: 1,
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
  cell: {
    width: 32,
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    textAlign: 'center',
  },
});
