import { Animated, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { type MatchStatus } from '@/types/match';
import {
  getStatusBg,
  getStatusColor,
  isMatchPending,
} from '@/utils/matchStatus';

interface MatchStatusBadgeProps {
  status: MatchStatus;
}

export const MatchStatusBadge = ({ status }: MatchStatusBadgeProps) => {
  const { t } = useTranslation('matches');
  const { tk } = useTheme();

  const pending = isMatchPending(status);
  const color = getStatusColor(status, tk);
  const bg = getStatusBg(status, tk);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pending) {
      pulseAnim.setValue(1);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pending, pulseAnim]);

  const badge = (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {t(`status.${status}`)
        .split(' ')
        .map((word, i) => (
          <Text
            key={i}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            style={[styles.badgeText, { color }]}
          >
            {word}
          </Text>
        ))}
    </View>
  );

  if (pending) {
    return (
      <Animated.View style={{ opacity: pulseAnim }}>{badge}</Animated.View>
    );
  }

  return badge;
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    marginHorizontal: spacing[1],
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
