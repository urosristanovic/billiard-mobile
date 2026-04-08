import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { iconSize } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import {
  TOURNAMENT_FORMAT_LABELS,
  type TournamentSummary,
} from '@/types/tournament';
import { DISCIPLINE_LABELS } from '@/types/match';
import { styles } from '../styles';

interface Props {
  tournament: TournamentSummary;
}

export const TournamentSummaryCard = ({ tournament }: Props) => {
  const { t } = useTranslation('tournaments');
  const { tk } = useTheme();

  return (
    <View
      style={[
        styles.tournamentCard,
        { backgroundColor: tk.surface.default, borderColor: tk.border.default },
      ]}
    >
      <View style={styles.nameRow}>
        {!tournament.isRated && (
          <View style={[styles.ratedBadge, { borderColor: tk.primary[400] }]}>
            <Text style={[styles.ratedBadgeText, { color: tk.primary[400] }]}>
              {t('ratedBadge')}
            </Text>
          </View>
        )}
        <Text style={[styles.tournamentName, { color: tk.text.primary }]}>
          {tournament.name}
        </Text>
      </View>
      <Text style={[styles.tournamentMeta, { color: tk.text.secondary }]}>
        {DISCIPLINE_LABELS[tournament.discipline]} ·{' '}
        {TOURNAMENT_FORMAT_LABELS[tournament.format]}
      </Text>
      <Text style={[styles.tournamentMeta, { color: tk.text.secondary }]}>
        {t(`status.${tournament.status}`)} ·{' '}
        {tournament.participantCount}/{tournament.maxParticipants}{' '}
        {t('detail.participants')}
      </Text>
      {tournament.location && (
        <Text style={[styles.tournamentMeta, { color: tk.text.muted }]}>
          📍 {tournament.location}
        </Text>
      )}
      <View style={styles.nameRow}>
        <Feather name='calendar' size={iconSize.sm} color={tk.text.muted} />
        <Text style={[styles.tournamentMeta, { color: tk.text.muted }]}>
          {new Date(tournament.scheduledAt).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      {tournament.description ? (
        <Text
          style={[styles.tournamentDescription, { color: tk.text.secondary }]}
        >
          {tournament.description}
        </Text>
      ) : null}
    </View>
  );
};
