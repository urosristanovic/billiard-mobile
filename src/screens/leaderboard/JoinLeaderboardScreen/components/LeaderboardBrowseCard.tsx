import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography, spacing, radius } from '@/constants/theme';
import { scale } from '@/utils/scale';
import type { BrowseLeaderboardResult } from '@/types/group';

interface LeaderboardBrowseCardProps {
  leaderboard: BrowseLeaderboardResult;
  onJoin: () => void;
  isJoining?: boolean;
  isDark?: boolean;
}

export const LeaderboardBrowseCard = ({
  leaderboard,
  onJoin,
  isJoining = false,
  isDark = false,
}: LeaderboardBrowseCardProps) => {
  const { t } = useTranslation('leaderboard');
  const tk = isDark ? theme.dark : theme.light;

  const { isMember, isPending, isPublic, name, description, memberCount } = leaderboard;
  const isDisabled = isMember || isPending || isJoining;

  const buttonLabel = isMember
    ? t('browse.joined')
    : isPending
      ? t('browse.pending')
      : isPublic
        ? t('browse.join')
        : t('browse.requestToJoin');

  const buttonColor = isMember || isPending ? tk.text.muted : tk.primary[500];
  const buttonBorderColor = isMember || isPending ? tk.border.default : tk.primary[600];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: tk.surface.raised,
          borderColor: tk.border.default,
        },
      ]}
    >
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <View
            style={[
              styles.badge,
              {
                borderColor: isPublic ? tk.primary[400] : tk.border.default,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: isPublic ? tk.primary[400] : tk.text.muted },
              ]}
            >
              {isPublic ? t('browse.public') : t('browse.private')}
            </Text>
          </View>
          <Text style={[styles.name, { color: tk.text.primary }]} numberOfLines={1}>
            {name}
          </Text>
        </View>

        {description ? (
          <Text style={[styles.description, { color: tk.text.secondary }]} numberOfLines={2}>
            {description}
          </Text>
        ) : null}

        <Text style={[styles.meta, { color: tk.text.muted }]}>
          {t('browse.members', { count: memberCount })}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onJoin}
        disabled={isDisabled}
        activeOpacity={0.8}
        accessibilityRole='button'
        style={[
          styles.button,
          { borderColor: buttonBorderColor },
          isDisabled && styles.buttonDisabled,
        ]}
      >
        {isJoining ? (
          <ActivityIndicator size='small' color={tk.primary[400]} />
        ) : (
          <Text style={[styles.buttonText, { color: buttonColor }]}>{buttonLabel}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  info: {
    flex: 1,
    gap: spacing[1],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  name: {
    flex: 1,
    fontSize: typography.size.base,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing[1] + 2,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    lineHeight: typography.size.sm * 1.4,
  },
  meta: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bodyMedium,
  },
  button: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    minWidth: scale(76),
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
