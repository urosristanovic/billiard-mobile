import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import {
  TOURNAMENT_FORMAT_LABELS,
  TOURNAMENT_STATUS_LABELS,
  type TournamentFormat,
  type TournamentStatus,
  type TournamentParticipantProfile,
} from '@/types/tournament';
import { DISCIPLINE_LABELS, type Discipline } from '@/types/match';
import { styles } from '../styles';

interface TournamentMetaProps {
  status: TournamentStatus;
  isRated: boolean;
  discipline: Discipline;
  format: TournamentFormat;
  location: string | null;
  scheduledAt: string;
  organizerProfile: TournamentParticipantProfile;
  description: string | null;
}

export const TournamentMeta = ({
  status,
  isRated,
  discipline,
  format,
  location,
  scheduledAt,
  organizerProfile,
  description,
}: TournamentMetaProps) => {
  const { t } = useTranslation('tournaments');
  const { tk } = useTheme();

  return (
    <View style={styles.metaSection}>
      <View style={styles.metaRow}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: tk.surface.overlay,
              borderColor: tk.border.default,
            },
          ]}
        >
          <Text style={[styles.statusText, { color: tk.primary[400] }]}>
            {TOURNAMENT_STATUS_LABELS[status]}
          </Text>
        </View>
        {isRated && (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: tk.surface.overlay, borderColor: tk.primary[400] },
            ]}
          >
            <Text style={[styles.statusText, { color: tk.primary[400] }]}>
              {t('ratedBadge')}
            </Text>
          </View>
        )}
        <Text style={[styles.metaItem, { color: tk.text.secondary }]}>
          {DISCIPLINE_LABELS[discipline]}
        </Text>
        <Text style={[styles.dot, { color: tk.text.muted }]}>·</Text>
        <Text style={[styles.metaItem, { color: tk.text.secondary }]}>
          {TOURNAMENT_FORMAT_LABELS[format]}
        </Text>
      </View>

      <View style={styles.metaDetails}>
        {location ? (
          <View style={styles.metaDetailRow}>
            <Text style={[styles.metaDetailIcon, { color: tk.text.muted }]}>
              📍
            </Text>
            <Text style={[styles.metaDetailText, { color: tk.text.primary }]}>
              {location}
            </Text>
          </View>
        ) : null}
        <View style={styles.metaDetailRow}>
          <Text style={[styles.metaDetailIcon, { color: tk.text.muted }]}>
            🗓
          </Text>
          <Text style={[styles.metaDetailText, { color: tk.text.primary }]}>
            {new Date(scheduledAt).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View style={styles.metaDetailRow}>
          <Text style={[styles.metaDetailIcon, { color: tk.text.muted }]}>
            👤
          </Text>
          <Text style={[styles.metaDetailText, { color: tk.text.primary }]}>
            {organizerProfile.displayName || organizerProfile.username}
          </Text>
          <Text style={[styles.metaDetailLabel, { color: tk.text.muted }]}>
            {t('detail.organizer').toLowerCase()}
          </Text>
        </View>
      </View>

      {description ? (
        <Text style={[styles.description, { color: tk.text.secondary }]}>
          {description}
        </Text>
      ) : null}
    </View>
  );
};
