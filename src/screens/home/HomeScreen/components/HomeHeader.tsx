import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Svg,
  Path,
  Circle,
  Defs,
  RadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { Loading } from '@/components/common/states';
import { GhostButton } from '@/components/common/buttons';
import { Feather } from '@expo/vector-icons';
import { styles } from '../styles';
import { iconSize } from '@/constants/theme';

interface HomeHeaderProps {
  tk: Record<string, any>;
  isDark: boolean;
  initials: string;
  displayName: string;
  username: string;
  stats: { played: number; wins: number; winRate: number; winStreak: number };
  activeFilterCount: number;
  isRefreshing: boolean;
  onSettingsPress: () => void;
  onFilterPress: () => void;
}

export const HomeHeader = React.memo(
  ({
    tk,
    isDark,
    initials,
    displayName,
    username,
    stats,
    activeFilterCount,
    isRefreshing,
    onSettingsPress,
    onFilterPress,
  }: HomeHeaderProps) => {
    const { t } = useTranslation('home');

    return (
      <>
        {isRefreshing && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 20,
            }}
          >
            <Loading />
          </View>
        )}
        <View
          style={[
            styles.card,
            {
              backgroundColor: tk.surface.default,
              borderColor: tk.border.strong,
            },
          ]}
        >
          <Svg style={StyleSheet.absoluteFill} pointerEvents='none'>
            <Defs>
              <RadialGradient id='glow' cx='100%' cy='0%' r='80%'>
                <Stop
                  offset='0%'
                  stopColor={tk.primary[500]}
                  stopOpacity='0.1'
                />
                <Stop
                  offset='100%'
                  stopColor={tk.primary[500]}
                  stopOpacity='0'
                />
              </RadialGradient>
            </Defs>
            <Rect width='100%' height='100%' fill='url(#glow)' />
          </Svg>

          <TouchableOpacity
            style={[
              styles.settingsBtn,
              {
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.08)',
              },
            ]}
            onPress={onSettingsPress}
            activeOpacity={0.7}
          >
            <Feather name='settings' size={iconSize.lg} color={tk.text.muted} />
          </TouchableOpacity>

          <View style={styles.userRow}>
            <View>
              <View style={[styles.avatar, { borderColor: tk.primary[500] }]}>
                <Text
                  style={[styles.avatarInitial, { color: tk.primary[500] }]}
                >
                  {initials}
                </Text>
              </View>
              <View
                style={[
                  styles.dotWrap,
                  { backgroundColor: tk.surface.default },
                ]}
              >
                <View style={styles.dot} />
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text
                style={[styles.displayName, { color: tk.text.primary }]}
                numberOfLines={1}
              >
                {displayName}
              </Text>
              <Text style={[styles.statusText, { color: tk.text.muted }]}>
                @{username}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { borderColor: tk.border.default }]}>
              <Text style={[styles.statCardLabel, { color: tk.text.muted }]}>
                {t('stats.winRecord')}
              </Text>
              <View style={styles.statCardValueRow}>
                <Text style={[styles.statCardBig, { color: tk.text.primary }]}>
                  {stats.played}
                </Text>
                <Text style={[styles.statCardSub, { color: tk.text.muted }]}>
                  {t('stats.played')}
                </Text>
              </View>
              <Text style={[styles.statCardAccent, { color: tk.primary[500] }]}>
                {stats.winRate}% {t('stats.winRate')}
              </Text>
            </View>

            <View style={[styles.statCard, { borderColor: tk.border.default }]}>
              <Text style={[styles.statCardLabel, { color: tk.text.muted }]}>
                {t('stats.winStreak')}
              </Text>
              <Text style={[styles.statCardBig, { color: tk.text.primary }]}>
                {`W${stats.winStreak > 0 ? stats.winStreak : 0}`}
              </Text>
              <View style={styles.miniGraph}>
                <Svg
                  viewBox='0 0 100 30'
                  preserveAspectRatio='none'
                  style={{ flex: 1 }}
                >
                  <Path
                    d='M0 25 L20 20 L40 28 L60 15 L80 18 L100 5'
                    fill='none'
                    stroke={tk.primary[500]}
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <Circle cx='100' cy='5' r='3' fill={tk.primary[500]} />
                </Svg>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: tk.text.secondary }]}>
            {t('recentMatches')}
          </Text>
          <GhostButton
            label={t('filters.title')}
            size='sm'
            icon={
              activeFilterCount > 0 ? undefined : (
                <Feather
                  name='sliders'
                  size={iconSize.sm}
                  color={tk.primary[600]}
                />
              )
            }
            active={activeFilterCount > 0}
            badge={activeFilterCount}
            isDark={isDark}
            accessibilityLabel={t('filters.title')}
            onPress={onFilterPress}
          />
        </View>
      </>
    );
  },
);
