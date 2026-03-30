import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { DISCIPLINE_LABELS, type Match } from '@/types/match';
import { styles } from '../styles';

interface MatchHeaderProps {
  match: Match;
}

export const MatchHeader = ({ match }: MatchHeaderProps) => {
  const { t } = useTranslation('matches');
  const { tk } = useTheme();

  const isChallengeRequested = match.status === 'challenge_requested';
  const isChallenge = match.status === 'challenge';

  const statusColor: Record<string, string> = {
    challenge_requested: tk.info.default,
    challenge: tk.primary[400],
    pending_confirmation: tk.warning.default,
    confirmed: tk.success.default,
    disputed: tk.error.default,
    cancelled: tk.text.muted,
  };

  const statusBg: Record<string, string> = {
    challenge_requested: tk.info.light,
    challenge: tk.primary[900],
    pending_confirmation: tk.warning.light,
    confirmed: tk.success.light,
    disputed: tk.error.light,
    cancelled: tk.surface.overlay,
  };

  return (
    <>
      <Text style={[styles.discipline, { color: tk.text.primary }]}>
        {DISCIPLINE_LABELS[match.discipline]}
      </Text>

      <View style={styles.metaRow}>
        <View
          style={[styles.badge, { backgroundColor: statusBg[match.status] }]}
        >
          <Text
            style={[styles.badgeText, { color: statusColor[match.status] }]}
          >
            {t(`status.${match.status}`)}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: match.isRated
                ? tk.info.light
                : tk.surface.overlay,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: match.isRated ? tk.info.default : tk.text.muted },
            ]}
          >
            {match.isRated ? t('detail.rated') : t('detail.unrated')}
          </Text>
        </View>
        {match.bestOf != null && (isChallengeRequested || isChallenge) && (
          <View
            style={[styles.badge, { backgroundColor: tk.primary[900] }]}
          >
            <Text style={[styles.badgeText, { color: tk.primary[300] }]}>
              BO{match.bestOf}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.date, { color: tk.text.muted }]}>
        {t('detail.playedAt')}:{' '}
        {new Date(match.playedAt).toLocaleDateString()}
      </Text>
    </>
  );
};
