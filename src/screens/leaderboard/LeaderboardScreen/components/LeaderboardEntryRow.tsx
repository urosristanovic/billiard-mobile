import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import type { LeaderboardEntry } from '@/types/rating';
import { styles } from '../styles';

interface Props {
  entry: LeaderboardEntry;
  isMe: boolean;
  onPress: () => void;
}

export const LeaderboardEntryRow = ({ entry, isMe, onPress }: Props) => {
  const { t } = useTranslation('leaderboard');
  const { tk } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.entryRow,
        { borderBottomColor: tk.primary[900] },
        isMe && {
          borderWidth: 1,
          borderColor: tk.primary[500],
          backgroundColor: tk.primary[900] + '20',
        },
      ]}
      activeOpacity={0.7}
    >
      <View style={[styles.rankBadge, { backgroundColor: tk.primary[900] }]}>
        <Text style={[styles.rankText, { color: tk.primary[300] }]}>
          {t('entry.rank', { rank: entry.rank })}
        </Text>
      </View>
      <View style={styles.entryInfo}>
        <Text
          style={[styles.entryName, { color: tk.text.primary }]}
          numberOfLines={1}
        >
          {entry.displayName}
        </Text>
        <Text
          style={[styles.entryUsername, { color: tk.text.muted }]}
          numberOfLines={1}
        >
          @{entry.username}
          {entry.country ? ` · ${entry.country}` : ''}
          {entry.city ? `, ${entry.city}` : ''}
        </Text>
      </View>
      <View style={styles.entryStats}>
        <View style={styles.entryRatingRow}>
          {entry.ratingChange != null && entry.ratingChange !== 0 && (
            <Text
              style={[
                styles.entryRatingChange,
                { color: entry.ratingChange > 0 ? '#4ade80' : '#f87171' },
              ]}
            >
              {entry.ratingChange > 0 ? `+${entry.ratingChange}` : entry.ratingChange}
            </Text>
          )}
          <Text style={[styles.entryRating, { color: tk.text.primary }]}>
            {Math.round(entry.rating)}
          </Text>
        </View>
        <Text style={[styles.entryWL, { color: tk.text.muted }]}>
          {entry.wins}W {entry.losses}L
        </Text>
        {entry.isProvisional && (
          <View
            style={[styles.provisionalBadge, { backgroundColor: tk.primary[800] }]}
          >
            <Text style={[styles.provisionalText, { color: tk.primary[300] }]}>
              {t('entry.provisional')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
