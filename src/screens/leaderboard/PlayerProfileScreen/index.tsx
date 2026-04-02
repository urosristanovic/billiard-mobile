import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import { FloatingActionButton } from '@/components/common/buttons/FloatingActionButton';
import { ChallengeModal } from '@/components/common/ChallengeModal';
import { usePlayerRatings } from '@/features/ratings/useRatings';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { QUERY_KEYS } from '@/config/queryKeys';
import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import { matchService } from '@/services/match';
import { gradients } from '@/constants/theme';
import { DISCIPLINE_LABELS } from '@/types/match';
import { styles } from './styles';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<LeaderboardStackParamList, 'PlayerProfile'>;

const PlayerProfileScreen = ({ route, navigation }: Props) => {
  const { userId } = route.params;
  const { t } = useTranslation('leaderboard');
  const { isDark, tk } = useTheme();
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);

  const { data: ratings = [], isLoading: ratingsLoading } =
    usePlayerRatings(userId);

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: QUERY_KEYS.USER_DETAIL(userId),
    queryFn: async () => {
      const token = await getAccessToken();
      const res = await fetchWithTimeout(API_ENDPOINTS.users.detail(userId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!userId,
  });

  const { data: h2hStats } = useQuery({
    queryKey: QUERY_KEYS.MATCH_STATS({ opponentId: userId }),
    queryFn: async () => {
      const token = await getAccessToken();
      return matchService.stats(token, { opponentId: userId });
    },
    enabled: !!userId,
  });

  if (profileLoading || ratingsLoading) {
    return (
      <ScreenLayout isDark={isDark}>
        <LoadingState isDark={isDark} />
      </ScreenLayout>
    );
  }

  if (profileError || !profile) {
    return (
      <ScreenLayout isDark={isDark}>
        <EmptyState
          title={
            profileError
              ? t('playerProfile.failedToLoad')
              : t('playerProfile.notFound')
          }
          description=''
          isDark={isDark}
        />
      </ScreenLayout>
    );
  }

  const totalMatches = ratings.reduce((sum, r) => sum + r.ratedGames, 0);
  const totalWins = ratings.reduce((sum, r) => sum + r.wins, 0);
  const winRate =
    totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        title={t('playerProfile.title')}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Hero */}
        <LinearGradient
          colors={
            (isDark ? gradients.dark.hero : gradients.light.hero) as [
              string,
              string,
            ]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { borderColor: tk.primary[900] }]}
        >
          <View
            style={[
              styles.avatarCircle,
              {
                backgroundColor: tk.background.secondary,
                borderColor: tk.primary[600],
              },
            ]}
          >
            <Text style={[styles.avatarInitial, { color: tk.primary[500] }]}>
              {profile.displayName?.slice(0, 2)?.toUpperCase() ?? '??'}
            </Text>
          </View>
          <Text style={[styles.displayName, { color: tk.text.primary }]}>
            {profile.displayName}
          </Text>
          <Text style={[styles.username, { color: tk.primary[500] }]}>
            @{profile.username}
          </Text>
          {profile.location && (
            <Text style={[styles.location, { color: tk.text.secondary }]}>
              📍 {profile.location}
            </Text>
          )}
          {profile.bio && (
            <Text style={[styles.bio, { color: tk.text.secondary }]}>
              {profile.bio}
            </Text>
          )}
        </LinearGradient>

        {/* Head to Head */}
        {h2hStats && h2hStats.played > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: tk.text.secondary }]}>
                {t('playerProfile.h2hSection')}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: tk.text.muted }]}>
                {t('playerProfile.h2hSubtitle')}
              </Text>
            </View>
            <View
              style={[
                styles.statsRow,
                {
                  backgroundColor: tk.surface.default,
                  borderColor: tk.primary[600],
                },
              ]}
            >
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: tk.text.primary }]}>
                  {h2hStats.played}
                </Text>
                <Text style={[styles.statLabel, { color: tk.text.muted }]}>
                  {t('playerProfile.played')}
                </Text>
              </View>
              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: tk.primary[600] },
                ]}
              />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: tk.primary[600] }]}>
                  {h2hStats.wins}
                </Text>
                <Text style={[styles.statLabel, { color: tk.text.muted }]}>
                  {t('playerProfile.wins')}
                </Text>
              </View>
              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: tk.primary[600] },
                ]}
              />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: tk.error.default }]}>
                  {h2hStats.played - h2hStats.wins}
                </Text>
                <Text style={[styles.statLabel, { color: tk.text.muted }]}>
                  {t('playerProfile.losses')}
                </Text>
              </View>
              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: tk.primary[600] },
                ]}
              />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: tk.text.primary }]}>
                  {h2hStats.winRate}%
                </Text>
                <Text style={[styles.statLabel, { color: tk.text.muted }]}>
                  {t('playerProfile.winRate')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: tk.text.secondary }]}>
              {t('playerProfile.statsSection')}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: tk.text.muted }]}>
              {t('playerProfile.ratedOnly')}
            </Text>
          </View>
          <View
            style={[
              styles.statsRow,
              {
                backgroundColor: tk.surface.default,
                borderColor: tk.primary[600],
              },
            ]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: tk.text.primary }]}>
                {totalMatches}
              </Text>
              <Text style={[styles.statLabel, { color: tk.text.muted }]}>
                {t('playerProfile.totalMatches')}
              </Text>
            </View>
            <View
              style={[styles.statDivider, { backgroundColor: tk.primary[600] }]}
            />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: tk.text.primary }]}>
                {winRate}%
              </Text>
              <Text style={[styles.statLabel, { color: tk.text.muted }]}>
                {t('playerProfile.winRate')}
              </Text>
            </View>
            <View
              style={[styles.statDivider, { backgroundColor: tk.primary[600] }]}
            />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: tk.primary[600] }]}>
                {totalWins}
              </Text>
              <Text style={[styles.statLabel, { color: tk.text.muted }]}>
                {t('playerProfile.wins')}
              </Text>
            </View>
          </View>
        </View>

        {/* Ratings */}
        {ratings.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: tk.text.secondary }]}>
              {t('playerProfile.ratingsSection')}
            </Text>
            {ratings.map(r => (
              <View
                key={r.discipline}
                style={[
                  styles.ratingCard,
                  {
                    backgroundColor: tk.surface.default,
                    borderColor: tk.primary[600],
                  },
                ]}
              >
                <Text
                  style={[styles.ratingDiscipline, { color: tk.primary[600] }]}
                >
                  {DISCIPLINE_LABELS[r.discipline]}
                </Text>
                <View style={styles.ratingValues}>
                  <Text
                    style={[styles.ratingNumber, { color: tk.text.primary }]}
                  >
                    {Math.round(r.rating)}
                  </Text>
                  <Text style={[styles.ratingRD, { color: tk.text.muted }]}>
                    ±{Math.round(r.ratingDeviation)}
                  </Text>
                  {r.isProvisional && (
                    <View
                      style={[
                        styles.provisionalBadge,
                        { backgroundColor: tk.primary[800] },
                      ]}
                    >
                      <Text
                        style={[
                          styles.provisionalText,
                          { color: tk.primary[300] },
                        ]}
                      >
                        {t('entry.provisionalLabel')}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.ratingWL, { color: tk.text.muted }]}>
                  {t('playerProfile.ratingRecord', {
                    wins: r.wins,
                    losses: r.losses,
                    games: r.ratedGames,
                  })}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <FloatingActionButton
        label={t('playerProfile.challengeButton')}
        onPress={() => setChallengeModalVisible(true)}
        style={styles.fab}
      />

      <ChallengeModal
        visible={challengeModalVisible}
        onClose={() => setChallengeModalVisible(false)}
        opponentId={userId}
        opponentName={profile?.displayName ?? profile?.username ?? userId}
      />
    </ScreenLayout>
  );
};

export default PlayerProfileScreen;
