import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { ScreenHeader } from '@/components/common/layout';
import { DISCIPLINE_LABELS, type Match } from '@/types/match';
import { getStatusBg, getStatusColor } from '@/utils/matchStatus';
import { styles } from '../styles';

interface MatchHeaderProps {
  match: Match;
  onBack: () => void;
}

export const MatchHeader = ({ match, onBack }: MatchHeaderProps) => {
  const { t } = useTranslation('matches');
  const { tk } = useTheme();

  const isChallengeRequested = match.status === 'challenge_requested';
  const isChallenge = match.status === 'challenge';

  return (
    <>
      <ScreenHeader
        title={DISCIPLINE_LABELS[match.discipline]}
        onBack={onBack}
      />

      <View style={styles.metaBadges}>
        <View style={styles.metaRow}>
          <View
            style={[
              styles.badge,
              { backgroundColor: getStatusBg(match.status, tk) },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getStatusColor(match.status, tk) },
              ]}
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
            <View style={[styles.badge, { backgroundColor: tk.primary[900] }]}>
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
      </View>
    </>
  );
};
