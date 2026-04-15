import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { typography, spacing, radius, iconSize } from '@/constants/theme';
import type { CustomLeaderboard } from '@/types/group';

interface Props {
  leaderboard: CustomLeaderboard;
  onMenuPress: () => void;
}

export const LeaderboardItemRow = ({ leaderboard, onMenuPress }: Props) => {
  const { tk } = useTheme();

  const hasPending = (leaderboard.pendingCount ?? 0) > 0;

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: tk.surface.default, borderColor: tk.border.default },
      ]}
    >
      {/* Name + visibility badge */}
      <View style={styles.left}>
        <Text
          style={[styles.name, { color: tk.text.primary }]}
          numberOfLines={1}
        >
          {leaderboard.name}
        </Text>
        <View style={styles.meta}>
          <View
            style={[
              styles.visibilityBadge,
              {
                backgroundColor: leaderboard.isPublic
                  ? `${tk.success.default}20`
                  : `${tk.primary[500]}20`,
              },
            ]}
          >
            <Text
              style={[
                styles.visibilityText,
                {
                  color: leaderboard.isPublic ? tk.success.default : tk.primary[500],
                },
              ]}
            >
              {leaderboard.isPublic ? 'Public' : 'Private'}
            </Text>
          </View>

          {hasPending && (
            <View
              style={[styles.pendingBadge, { backgroundColor: tk.primary[500] }]}
            >
              <Text style={[styles.pendingText, { color: tk.text.onPrimary }]}>
                {leaderboard.pendingCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Three-dot menu */}
      <Pressable
        onPress={onMenuPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={({ pressed }) => [
          styles.menuBtn,
          pressed && { opacity: 0.5 },
        ]}
        accessibilityRole='button'
        accessibilityLabel='More options'
      >
        <Feather name='more-vertical' size={iconSize.md} color={tk.text.muted} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing[3],
  },
  left: {
    flex: 1,
    gap: spacing[1],
  },
  name: {
    fontSize: typography.size.base,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.semibold,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  visibilityBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  visibilityText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pendingBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[1],
  },
  pendingText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
  },
  menuBtn: {
    padding: spacing[1],
  },
});
