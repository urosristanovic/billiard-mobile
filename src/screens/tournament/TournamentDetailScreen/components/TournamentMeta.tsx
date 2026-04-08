import { useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { iconSize } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { DangerButton, TournamentStatusBadge } from '@/components/common';
import {
  TOURNAMENT_FORMAT_LABELS,
  type TournamentFormat,
  type TournamentStatus,
  type TournamentParticipantProfile,
} from '@/types/tournament';
import { DISCIPLINE_LABELS, type Discipline } from '@/types/match';
import { styles } from '../styles';

interface TournamentMetaProps {
  status: TournamentStatus;
  isRated: boolean;
  discipline: Discipline;
  format: TournamentFormat;
  location: string | null;
  scheduledAt: string;
  organizerProfile: TournamentParticipantProfile;
  description: string | null;
  onCancel?: () => void;
}

export const TournamentMeta = ({
  status,
  isRated,
  discipline,
  format,
  location,
  scheduledAt,
  organizerProfile,
  description,
  onCancel,
}: TournamentMetaProps) => {
  const { t } = useTranslation('tournaments');
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
    <View style={styles.metaSection}>
      <View style={styles.metaRow}>
        <TournamentStatusBadge status={status} isDark={isDark} />
        {isRated && (
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: tk.surface.overlay,
                borderColor: tk.primary[500],
              },
            ]}
          >
            <Text style={[styles.statusText, { color: tk.primary[500] }]}>
              {t('ratedBadge')}
            </Text>
          </View>
        )}
        <Text style={[styles.metaItem, { color: tk.text.secondary }]}>
          {DISCIPLINE_LABELS[discipline]}
        </Text>
        <Text style={[styles.dot, { color: tk.text.muted }]}>·</Text>
        <Text style={[styles.metaItem, { color: tk.text.secondary }]}>
          {TOURNAMENT_FORMAT_LABELS[format]}
        </Text>
        {onCancel && (
          <DangerButton
            label={t('detail.actions.cancel')}
            size='xs'
            isDark={isDark}
            style={{ marginLeft: 'auto' }}
            onPress={onCancel}
          />
        )}
      </View>

      {!isCollapsed && (
        <Animated.View style={{ opacity: contentOpacity }}>
          <View style={styles.metaDetails}>
            {location ? (
              <View style={styles.metaDetailRow}>
                <Feather name='map-pin' size={iconSize.sm} color={tk.text.muted} />
                <Text
                  style={[styles.metaDetailText, { color: tk.text.primary }]}
                >
                  {location}
                </Text>
              </View>
            ) : null}
            <View style={styles.metaDetailRow}>
              <Feather name='calendar' size={iconSize.sm} color={tk.text.muted} />
              <Text style={[styles.metaDetailText, { color: tk.text.primary }]}>
                {new Date(scheduledAt).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.metaDetailRow}>
              <Feather name='user' size={iconSize.sm} color={tk.text.muted} />
              <Text style={[styles.metaDetailText, { color: tk.text.primary }]}>
                {organizerProfile.displayName || organizerProfile.username}
              </Text>
              <Text style={[styles.metaDetailLabel, { color: tk.text.muted }]}>
                {t('detail.organizer').toLowerCase()}
              </Text>
            </View>
          </View>

          {description ? (
            <ScrollView
              style={styles.descriptionScroll}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              <Text style={[styles.description, { color: tk.text.secondary }]}>
                {description}
              </Text>
            </ScrollView>
          ) : null}
        </Animated.View>
      )}

      <Pressable onPress={toggle} style={styles.metaCollapseBtn} hitSlop={8}>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Feather name='chevron-up' size={iconSize.lg} color={tk.primary[600]} />
        </Animated.View>
      </Pressable>
    </View>
  );
};
