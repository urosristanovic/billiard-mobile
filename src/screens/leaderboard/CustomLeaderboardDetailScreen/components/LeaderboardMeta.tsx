import { useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { iconSize, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { DangerButton } from '@/components/common/buttons/DangerButton';
import type { CustomLeaderboard } from '@/types/group';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface LeaderboardMetaProps {
  lb: CustomLeaderboard;
  isCreator: boolean;
  onDelete?: () => void;
}

export const LeaderboardMeta = ({ lb, isCreator, onDelete }: LeaderboardMetaProps) => {
  const { t } = useTranslation('groups');
  const { isDark, tk } = useTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const chevronRotation = useRef(new Animated.Value(0)).current;

  const layoutAnimation = LayoutAnimation.create(
    300,
    LayoutAnimation.Types.easeInEaseOut,
    LayoutAnimation.Properties.opacity,
  );

  const toggle = () => {
    Animated.timing(chevronRotation, {
      toValue: isCollapsed ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (!isCollapsed) {
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        LayoutAnimation.configureNext(layoutAnimation);
        setIsCollapsed(true);
      });
    } else {
      LayoutAnimation.configureNext(layoutAnimation);
      setIsCollapsed(false);
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 250,
        delay: 80,
        useNativeDriver: true,
      }).start();
    }
  };

  const chevronRotate = chevronRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        {!lb.isPublic && (
          <View
            style={[
              styles.badge,
              { backgroundColor: `${tk.border.strong}30` },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: tk.text.muted },
              ]}
            >
              {t('customLeaderboards.privateLabel', { defaultValue: 'Private' })}
            </Text>
          </View>
        )}
        <Text style={[styles.memberCount, { color: tk.text.muted }]}>
          {t('customLeaderboards.memberCount', { count: lb.memberCount })}
        </Text>
        {isCreator && onDelete && (
          <DangerButton
            size='xs'
            isDark={isDark}
            label={t('customLeaderboards.delete')}
            onPress={onDelete}
            style={{ marginLeft: 'auto' }}
          />
        )}
      </View>

      {!isCollapsed && (
        <Animated.View style={{ opacity: contentOpacity }}>
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Feather name='hash' size={iconSize.sm} color={tk.text.muted} />
              <Text style={[styles.detailText, { color: tk.text.primary }]}>
                {t('customLeaderboards.thresholdLabel')}: {lb.provisionalThreshold}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Feather name='calendar' size={iconSize.sm} color={tk.text.muted} />
              <Text style={[styles.detailText, { color: tk.text.primary }]}>
                {t('customLeaderboards.createdAtLabel')}:{' '}
                {new Date(lb.createdAt).toLocaleDateString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
            {lb.description ? (
              <Text style={[styles.description, { color: tk.text.secondary }]}>
                {lb.description}
              </Text>
            ) : null}
            <View style={styles.detailRow}>
              <Feather
                name='trending-down'
                size={iconSize.sm}
                color={lb.inactivityDecayEnabled ? tk.text.muted : tk.text.disabled}
              />
              <Text
                style={[
                  styles.detailText,
                  { color: lb.inactivityDecayEnabled ? tk.text.secondary : tk.text.disabled },
                ]}
              >
                {lb.inactivityDecayEnabled
                  ? t('customLeaderboards.decayNoteEnabled', { count: lb.inactivityGraceWeeks, weeks: lb.inactivityGraceWeeks })
                  : t('customLeaderboards.decayNoteDisabled')}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      <Pressable onPress={toggle} style={styles.collapseBtn} hitSlop={8}>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Feather name='chevron-up' size={iconSize.lg} color={tk.primary[600]} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing[3],
    paddingBottom: spacing[2],
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  badge: {
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
  memberCount: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.bodyMedium,
  },
  details: {
    gap: spacing[2],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  detailText: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  description: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    lineHeight: typography.size.sm * 1.5,
  },
  collapseBtn: {
    alignItems: 'center',
    paddingBottom: spacing[1],
  },
});
