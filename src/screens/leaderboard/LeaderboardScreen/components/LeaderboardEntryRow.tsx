import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import type { LeaderboardEntry } from '@/types/rating';
import { spacing, radius, typography, iconSize } from '@/constants/theme';
import { scale } from '@/utils/scale';

interface Props {
  entry: LeaderboardEntry;
  isMe: boolean;
  onPress: () => void;
}

const countryCodeToFlag = (code: string) =>
  code
    .toUpperCase()
    .replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));

const TrendIndicator = ({ change }: { change: number | null }) => {
  const { tk } = useTheme();
  if (change == null || change === 0) return null;
  const isUp = change > 0;
  const color = isUp ? tk.success.default : tk.error.default;
  return (
    <View style={styles.trendRow}>
      <Feather
        name={isUp ? 'arrow-up-right' : 'arrow-down-right'}
        size={iconSize.xs}
        color={color}
      />
      <Text style={[styles.trendText, { color }]}>
        {isUp ? `+${change}` : change}
      </Text>
    </View>
  );
};

export const LeaderboardEntryRow = ({ entry, isMe, onPress }: Props) => {
  const { tk } = useTheme();

  const initials = (
    entry.displayName?.slice(0, 2) ||
    entry.username?.slice(0, 2) ||
    'U'
  ).toUpperCase();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.row,
        isMe
          ? {
              backgroundColor: `${tk.primary[500]}14`,
              borderColor: `${tk.primary[500]}4D`,
            }
          : {
              backgroundColor: tk.surface.default,
              borderColor: tk.border.default,
            },
      ]}
    >
      {/* Rank */}
      <View style={styles.rankWrap}>
        <Text style={[styles.rank, { color: `${tk.text.primary}66` }]}>
          {entry.rank}
        </Text>
      </View>

      {/* Avatar + flag */}
      <View style={styles.avatarWrap}>
        {entry.avatarUrl ? (
          <Image
            source={{ uri: entry.avatarUrl }}
            style={[styles.avatar, { borderColor: tk.border.strong }]}
            contentFit='cover'
          />
        ) : (
          <View
            style={[
              styles.avatar,
              styles.avatarFallback,
              {
                borderColor: tk.border.strong,
                backgroundColor: tk.surface.raised,
              },
            ]}
          >
            <Text style={[styles.avatarInitials, { color: tk.text.muted }]}>
              {initials}
            </Text>
          </View>
        )}
        {entry.countryCode && (
          <Text style={styles.flag}>
            {countryCodeToFlag(entry.countryCode)}
          </Text>
        )}
      </View>

      {/* Name + handle */}
      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            { color: isMe ? tk.primary[400] : tk.text.primary },
          ]}
          numberOfLines={1}
        >
          {entry.displayName}
        </Text>
        <Text
          style={[styles.handle, { color: tk.text.muted }]}
          numberOfLines={1}
        >
          @{entry.username}
        </Text>
      </View>

      {/* Rating + trend */}
      <View style={styles.stats}>
        <Text style={[styles.rating, { color: tk.text.primary }]}>
          {Math.round(entry.rating)}
        </Text>
        <TrendIndicator change={entry.ratingChange} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    borderRadius: radius['4xl'],
    borderWidth: 1,
    gap: spacing[3],
  },
  rankWrap: {
    width: scale(20),
    alignItems: 'center',
  },
  rank: {
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: radius.full,
    borderWidth: 1,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
  },
  flag: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    fontSize: typography.size.xs,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.size.lg,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.bold,
  },
  handle: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    marginTop: 2,
  },
  stats: {
    alignItems: 'flex-end',
    gap: spacing[2],
  },
  rating: {
    fontSize: typography.size.xl,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  trendText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
  },
});
