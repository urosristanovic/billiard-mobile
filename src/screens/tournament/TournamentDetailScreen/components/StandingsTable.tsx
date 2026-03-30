import { Text, View, StyleSheet } from 'react-native';
import { theme, typography, spacing } from '@/constants/theme';
import type { StandingsRow } from '@/types/tournament';

interface StandingsTableProps {
  rows: StandingsRow[];
  isDark?: boolean;
}

export const StandingsTable = ({
  rows,
  isDark = false,
}: StandingsTableProps) => {
  const tk = isDark ? theme.dark : theme.light;

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.headerRow, { borderBottomColor: tk.border.default }]}>
        <Text style={[styles.rank, { color: tk.text.muted }]}>#</Text>
        <Text style={[styles.name, { color: tk.text.muted }]}>Player</Text>
        <Text style={[styles.cell, { color: tk.text.muted }]}>W</Text>
        <Text style={[styles.cell, { color: tk.text.muted }]}>L</Text>
        <Text style={[styles.cell, { color: tk.text.muted }]}>+/-</Text>
        <Text style={[styles.cell, { color: tk.primary[400] }]}>Pts</Text>
      </View>

      {rows.map((row, idx) => {
        const prev = rows[idx - 1];
        const isTiedWithPrev =
          prev !== undefined &&
          row.points === prev.points &&
          row.scored - row.conceded === prev.scored - prev.conceded;
        const rank = isTiedWithPrev
          ? rows.findIndex(
              r =>
                r.points === row.points &&
                r.scored - r.conceded === row.scored - row.conceded,
            ) + 1
          : idx + 1;

        const diff = row.scored - row.conceded;
        const diffColor =
          diff > 0 ? tk.primary[400] : diff < 0 ? tk.error.text : tk.text.muted;

        return (
          <View
            key={row.userId}
            style={[
              styles.row,
              { borderBottomColor: tk.border.subtle },
              rank === 1 && { backgroundColor: tk.primary[900] + '33' },
            ]}
          >
            <Text style={[styles.rank, { color: tk.text.muted }]}>
              {rank}
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
            <Text style={[styles.cell, { color: diffColor }]}>
              {diff > 0 ? `+${diff}` : diff}
            </Text>
            <Text style={[styles.cell, { color: tk.primary[400] }]}>
              {row.points}
            </Text>
          </View>
        );
      })}
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
