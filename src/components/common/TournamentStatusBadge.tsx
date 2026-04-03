import { Text, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';
import { type TournamentStatus, TOURNAMENT_STATUS_LABELS } from '@/types/tournament';
import {
  getTournamentStatusColor,
  getTournamentStatusBg,
  getTournamentStatusBorder,
} from '@/utils/tournamentStatus';

interface TournamentStatusBadgeProps {
  status: TournamentStatus;
  /** Show the winner badge (icon + label) instead of the status */
  isWinner?: boolean;
  /** 'badge' renders a pill with background/border; 'text' renders plain colored text */
  variant?: 'badge' | 'text';
  isDark?: boolean;
}

export const TournamentStatusBadge = ({
  status,
  isWinner = false,
  variant = 'badge',
  isDark = false,
}: TournamentStatusBadgeProps) => {
  const { t } = useTranslation('tournaments');
  const tk = isDark ? theme.dark : theme.light;

  if (isWinner) {
    return (
      <View style={styles.winnerBadge}>
        <Feather name='award' size={12} color={tk.primary[600]} />
        <Text style={[styles.text, { color: tk.primary[600] }]}>
          {t('home.past.winnerBadge')}
        </Text>
      </View>
    );
  }

  if (variant === 'text') {
    return (
      <Text
        style={[
          styles.text,
          { color: status === 'cancelled' ? tk.error.text : tk.primary[500] },
        ]}
      >
        {TOURNAMENT_STATUS_LABELS[status]}
      </Text>
    );
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getTournamentStatusBg(status, tk),
          borderColor: getTournamentStatusBorder(status, tk),
        },
      ]}
    >
      <Text
        style={[styles.badgeText, { color: getTournamentStatusColor(status, tk) }]}
      >
        {TOURNAMENT_STATUS_LABELS[status]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  text: {
    fontSize: typography.size.xs,
    textTransform: 'uppercase',
  },
  badge: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
