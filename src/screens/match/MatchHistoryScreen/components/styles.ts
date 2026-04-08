import { Dimensions, StyleSheet } from 'react-native';
import { typography, spacing, radius, breakpoints } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: radius['2xl'],
    borderWidth: 1,
    paddingVertical: spacing[4],
    paddingLeft: spacing[4],
  },

  // ── Left column ──────────────────────────────────────────
  leftCol: {
    width: SCREEN_WIDTH <= breakpoints.xs ? spacing[28] : spacing[24],
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    marginLeft: spacing[3],
    gap: spacing[1],
  },
  timeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    textAlign: 'center',
    lineHeight: 14,
  },

  // ── Right column ─────────────────────────────────────────
  rightCol: {
    flex: 1,
    gap: spacing[3],
    justifyContent: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  avatar: {
    width: spacing[8],
    height: spacing[8],
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    fontWeight: typography.weight.bold,
  },
  playerName: {
    flex: 1,
    fontSize: typography.size.lg,
    fontFamily: typography.family.bodyMedium,
    fontWeight: typography.weight.medium,
  },
  playerScore: {
    fontSize: typography.size['2xl'],
    fontFamily: typography.family.bodyBold,
    fontWeight: typography.weight.bold,
  },
  rowDivider: {
    height: 1,
    marginVertical: -spacing[1],
  },
});
