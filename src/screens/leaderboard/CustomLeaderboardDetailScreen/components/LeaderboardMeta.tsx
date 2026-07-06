import { useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { iconSize, radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { DangerButton } from '@/components/common/buttons/DangerButton';
import { SecondaryButton } from '@/components/common/buttons/SecondaryButton';
import type { CustomLeaderboard } from '@/types/group';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface LeaderboardMetaProps {
  lb: CustomLeaderboard;
  isCreator: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const LeaderboardMeta = ({
  lb,
  isCreator,
  onEdit,
  onDelete,
}: LeaderboardMetaProps) => {
  const { t } = useTranslation('groups');
  const { t: tCommon } = useTranslation('common');
  const { isDark, tk } = useTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const chevronRotation = useRef(new Animated.Value(0)).current;

  const [descScrollable, setDescScrollable] = useState(false);
  const [descAtBottom, setDescAtBottom] = useState(false);
  const descContentH = useRef(0);
  const descViewH = useRef(0);

  const recomputeDescScrollable = () => {
    const scrollable = descContentH.current > descViewH.current + 2;
    setDescScrollable(scrollable);
    if (!scrollable) setDescAtBottom(false);
  };

  const handleDescScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    setDescAtBottom(
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 4,
    );
  };

  const showDescFade = descScrollable && !descAtBottom;

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
            style={[styles.badge, { backgroundColor: `${tk.border.strong}30` }]}
          >
            <Text style={[styles.badgeText, { color: tk.text.muted }]}>
              {t('customLeaderboards.privateLabel', {
                defaultValue: 'Private',
              })}
            </Text>
          </View>
        )}
        <Text style={[styles.memberCount, { color: tk.text.muted }]}>
          {t('customLeaderboards.memberCount', { count: lb.memberCount })}
        </Text>
        {isCreator && (onEdit || onDelete) && (
          <View style={styles.actions}>
            {onDelete && (
              <DangerButton
                size='xs'
                isDark={isDark}
                label={t('customLeaderboards.delete')}
                onPress={onDelete}
              />
            )}
            {onEdit && (
              <SecondaryButton
                size='xs'
                isDark={isDark}
                label={tCommon('edit')}
                icon={
                  <Feather
                    name='edit-2'
                    size={iconSize.xs}
                    color={tk.primary[500]}
                  />
                }
                onPress={onEdit}
              />
            )}
          </View>
        )}
      </View>

      {!isCollapsed && (
        <Animated.View style={{ opacity: contentOpacity }}>
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Feather name='hash' size={iconSize.sm} color={tk.text.muted} />
              <Text style={[styles.detailText, { color: tk.text.primary }]}>
                {t('customLeaderboards.thresholdLabel')}:{' '}
                {lb.provisionalThreshold}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Feather
                name='calendar'
                size={iconSize.sm}
                color={tk.text.muted}
              />
              <Text style={[styles.detailText, { color: tk.text.primary }]}>
                {t('customLeaderboards.createdAtLabel')}:{' '}
                {new Date(lb.createdAt).toLocaleDateString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Feather
                name='trending-down'
                size={iconSize.sm}
                color={
                  lb.inactivityDecayEnabled
                    ? tk.error.default
                    : tk.text.disabled
                }
              />
              <Text
                style={[
                  styles.detailText,
                  {
                    color: lb.inactivityDecayEnabled
                      ? tk.text.primary
                      : tk.text.disabled,
                  },
                ]}
              >
                {lb.inactivityDecayEnabled
                  ? t('customLeaderboards.decayNoteEnabled', {
                      count: lb.inactivityGraceWeeks,
                      weeks: lb.inactivityGraceWeeks,
                    })
                  : t('customLeaderboards.decayNoteDisabled')}
              </Text>
            </View>
            {lb.description ? (
              <View style={styles.descriptionWrapper}>
                <ScrollView
                  style={styles.descriptionScroll}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                  keyboardShouldPersistTaps='handled'
                  scrollEventThrottle={16}
                  onScroll={handleDescScroll}
                  onLayout={e => {
                    descViewH.current = e.nativeEvent.layout.height;
                    recomputeDescScrollable();
                  }}
                  onContentSizeChange={(_, h) => {
                    descContentH.current = h;
                    recomputeDescScrollable();
                  }}
                >
                  <Text
                    style={[styles.description, { color: tk.text.secondary }]}
                  >
                    {lb.description}
                  </Text>
                </ScrollView>
                {showDescFade && (
                  <LinearGradient
                    pointerEvents='none'
                    colors={[
                      `${tk.background.primary}00`,
                      tk.background.primary,
                    ]}
                    style={styles.descriptionFade}
                  >
                    <Feather
                      name='chevron-down'
                      size={iconSize.sm}
                      color={tk.text.muted}
                    />
                  </LinearGradient>
                )}
              </View>
            ) : null}
          </View>
        </Animated.View>
      )}

      <Pressable onPress={toggle} style={styles.collapseBtn} hitSlop={8}>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Feather
            name='chevron-up'
            size={iconSize.lg}
            color={tk.primary[600]}
          />
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginLeft: 'auto',
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
  descriptionWrapper: {
    position: 'relative',
  },
  descriptionScroll: {
    maxHeight: typography.size.sm * 1.5 * 10,
  },
  descriptionFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: typography.size.sm * 1.5 * 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  description: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    lineHeight: typography.size.sm * 1.5,
  },
  collapseBtn: {
    alignItems: 'flex-end',
    paddingBottom: spacing[1],
    paddingTop: spacing[2],
  },
});
