import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme, typography, spacing, radius } from '@/constants/theme';
import type { TournamentMatch } from '@/types/tournament';

interface CurrentMatchesProps {
  matches: TournamentMatch[];
  isDark?: boolean;
  title: string;
  emptyLabel: string;
  recordResultLabel: string;
  onRecordResult: (match: TournamentMatch) => void;
  canRecord?: boolean;
}

export const CurrentMatches = ({
  matches,
  isDark = false,
  title,
  emptyLabel,
  recordResultLabel,
  onRecordResult,
  canRecord = false,
}: CurrentMatchesProps) => {
  const tk = isDark ? theme.dark : theme.light;
  const playableMatches = matches.filter(
    match => match.homeUserId && match.awayUserId && !match.winnerId,
  );

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: tk.border.default,
          backgroundColor: tk.surface.overlay,
        },
      ]}
    >
      <Text style={[styles.title, { color: tk.text.muted }]}>{title}</Text>
      {playableMatches.length === 0 ? (
        <Text style={[styles.emptyText, { color: tk.text.muted }]}>
          {emptyLabel}
        </Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {playableMatches.map(match => {
            const homeName =
              match.homeProfile?.displayName ||
              match.homeProfile?.username ||
              'TBD';
            const awayName =
              match.awayProfile?.displayName ||
              match.awayProfile?.username ||
              'TBD';

            return (
              <View
                key={match.id}
                style={[
                  styles.row,
                  {
                    borderColor: tk.border.subtle,
                    backgroundColor: tk.surface.raised,
                  },
                ]}
              >
                <Text style={[styles.players, { color: tk.text.primary }]}>
                  {homeName} vs {awayName}
                </Text>
                {canRecord && (
                  <TouchableOpacity
                    onPress={() => onRecordResult(match)}
                    style={[
                      styles.button,
                      {
                        borderColor: tk.primary[700],
                        backgroundColor: tk.primary[500],
                      },
                    ]}
                  >
                    <Text
                      style={[styles.buttonLabel, { color: tk.text.onPrimary }]}
                    >
                      {recordResultLabel}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing[3],
    gap: spacing[2],
  },
  title: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  listContent: {
    gap: spacing[2],
  },
  row: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing[2],
    gap: spacing[2],
  },
  players: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.bodyMedium,
  },
  button: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    alignSelf: 'flex-start',
  },
  buttonLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
