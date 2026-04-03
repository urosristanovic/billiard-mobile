import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import {
  theme,
  gradients,
  typography,
  spacing,
  radius,
} from '@/constants/theme';

interface TournamentStatsRowProps {
  stats: { active: number; won: number };
  isDark?: boolean;
}

export const TournamentStatsRow = ({
  stats,
  isDark = false,
}: TournamentStatsRowProps) => {
  const { t } = useTranslation('tournaments');
  const tk = isDark ? theme.dark : theme.light;
  const heroGradient = gradients[isDark ? 'dark' : 'light'].hero as [
    string,
    string,
  ];

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: tk.surface.raised,
            borderColor: tk.border.default,
          },
        ]}
      >
        <Text style={[styles.value, { color: tk.text.primary }]}>
          {stats.active}
        </Text>
        <Text style={[styles.label, { color: tk.text.secondary }]}>
          {t('home.stats.active')}
        </Text>
      </View>

      <LinearGradient
        colors={heroGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderColor: tk.primaryTint.border }]}
      >
        <Text
          style={[
            styles.value,
            {
              color: tk.primary[400],
              textShadowColor: tk.primaryTint.glow,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 12,
            },
          ]}
        >
          {stats.won}
        </Text>
        <Text style={[styles.label, { color: tk.primaryTint.labelMuted }]}>
          {t('home.stats.won')}
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[4],
    flexDirection: 'row',
    gap: spacing[3],
  },
  card: {
    flex: 1,
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[3],
    borderRadius: radius['3xl'],
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    overflow: 'hidden',
  },
  value: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  label: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
