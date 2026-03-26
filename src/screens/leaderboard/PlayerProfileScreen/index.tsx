import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout } from '@/components/common/layout';
import { LoadingState, EmptyState } from '@/components/common/states';
import { PrimaryButton } from '@/components/common/buttons';
import { ChallengeModal } from '@/components/common/ChallengeModal';
import { usePlayerRatings } from '@/features/ratings/useRatings';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { QUERY_KEYS } from '@/config/queryKeys';
import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import { matchService } from '@/services/match';
import { typography, spacing, radius } from '@/constants/theme';
import { DISCIPLINE_LABELS } from '@/types/match';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<LeaderboardStackParamList, 'PlayerProfile'>;

const PlayerProfileScreen = ({ route, navigation }: Props) => {
  const { userId } = route.params;
  const { t } = useTranslation('leaderboard');
  const { isDark, tk } = useTheme();
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);

  const { data: ratings = [], isLoading: ratingsLoading } = usePlayerRatings(userId);

  const { data: profile, isLoading: profileLoading, isError: profileError } = useQuery({
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
          title={profileError ? 'Failed to load player' : 'Player not found'}
          description=''
          isDark={isDark}
        />
      </ScreenLayout>
    );
  }

  const totalMatches = ratings.reduce((sum, r) => sum + r.ratedGames, 0);
  const totalWins = ratings.reduce((sum, r) => sum + r.wins, 0);
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;

  return (
    <ScreenLayout isDark={isDark}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back button */}
        <View style={styles.headerRow}>
          <Text
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { color: tk.primary[400] }]}
          >
            ← Back
          </Text>
        </View>

        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: tk.surface.raised, borderColor: tk.primary[800] }]}>
          <View style={[styles.avatarCircle, { backgroundColor: tk.background.secondary, borderColor: tk.primary[500] }]}>
            <Text style={[styles.avatarInitial, { color: tk.primary[300] }]}>
              {profile.displayName?.slice(0, 2)?.toUpperCase() ?? '??'}
            </Text>
          </View>
          <Text style={[styles.displayName, { color: tk.text.primary }]}>
            {profile.displayName}
          </Text>
          <Text style={[styles.username, { color: tk.text.muted }]}>
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
        </View>

        {/* Head to Head */}
        {h2hStats && h2hStats.played > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: tk.text.secondary }]}>
                Head to Head
              </Text>
              <Text style={[styles.sectionSubtitle, { color: tk.text.muted }]}>
                Rated & unrated matches
              </Text>
            </View>
            <View style={[styles.statsRow, { backgroundColor: tk.surface.raised, borderColor: tk.primary[800] }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: tk.text.primary }]}>
                  {h2hStats.played}
                </Text>
                <Text style={[styles.statLabel, { color: tk.text.muted }]}>Played</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: tk.primary[800] }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: tk.primary[300] }]}>
                  {h2hStats.wins}
                </Text>
                <Text style={[styles.statLabel, { color: tk.text.muted }]}>Wins</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: tk.primary[800] }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: tk.error.default }]}>
                  {h2hStats.played - h2hStats.wins}
                </Text>
                <Text style={[styles.statLabel, { color: tk.text.muted }]}>Losses</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: tk.primary[800] }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: tk.text.primary }]}>
                  {h2hStats.winRate}%
                </Text>
                <Text style={[styles.statLabel, { color: tk.text.muted }]}>Win Rate</Text>
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
              Rated matches only
            </Text>
          </View>
          <View style={[styles.statsRow, { backgroundColor: tk.surface.raised, borderColor: tk.primary[800] }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: tk.text.primary }]}>{totalMatches}</Text>
              <Text style={[styles.statLabel, { color: tk.text.muted }]}>
                {t('playerProfile.totalMatches')}
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: tk.primary[800] }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: tk.text.primary }]}>{winRate}%</Text>
              <Text style={[styles.statLabel, { color: tk.text.muted }]}>
                {t('playerProfile.winRate')}
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: tk.primary[800] }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: tk.text.primary }]}>{totalWins}</Text>
              <Text style={[styles.statLabel, { color: tk.text.muted }]}>
                {t('entry.wins')}
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
                style={[styles.ratingCard, { backgroundColor: tk.surface.raised, borderColor: tk.primary[800] }]}
              >
                <Text style={[styles.ratingDiscipline, { color: tk.primary[300] }]}>
                  {DISCIPLINE_LABELS[r.discipline]}
                </Text>
                <View style={styles.ratingValues}>
                  <Text style={[styles.ratingNumber, { color: tk.text.primary }]}>
                    {Math.round(r.rating)}
                  </Text>
                  <Text style={[styles.ratingRD, { color: tk.text.muted }]}>
                    ±{Math.round(r.ratingDeviation)}
                  </Text>
                  {r.isProvisional && (
                    <View style={[styles.provisionalBadge, { backgroundColor: tk.primary[800] }]}>
                      <Text style={[styles.provisionalText, { color: tk.primary[300] }]}>
                        {t('entry.provisionalLabel')}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.ratingWL, { color: tk.text.muted }]}>
                  {r.wins}W {r.losses}L · {r.ratedGames} games
                </Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            borderTopColor: tk.border.default,
            backgroundColor: tk.surface.default,
          },
        ]}
      >
        <PrimaryButton
          label={t('playerProfile.challengeButton')}
          onPress={() => setChallengeModalVisible(true)}
          isDark={isDark}
          style={styles.bottomBarButton}
        />
      </View>

      <ChallengeModal
        visible={challengeModalVisible}
        onClose={() => setChallengeModalVisible(false)}
        opponentId={userId}
        opponentName={profile?.displayName ?? profile?.username ?? userId}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing[20],
  },
  headerRow: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[2],
  },
  backButton: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hero: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[3],
    padding: spacing[5],
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: spacing[2],
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  avatarInitial: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  displayName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
    textAlign: 'center',
  },
  username: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  location: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  bio: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
    textAlign: 'center',
    marginTop: spacing[1],
  },
  section: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
    gap: spacing[2],
  },
  sectionHeader: {
    gap: 2,
    marginBottom: spacing[1],
  },
  sectionTitle: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  statLabel: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    marginVertical: spacing[3],
  },
  ratingCard: {
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[1],
  },
  ratingDiscipline: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  ratingValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  ratingNumber: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: typography.family.display,
  },
  ratingRD: {
    fontSize: typography.size.sm,
    fontFamily: typography.family.body,
  },
  provisionalBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  provisionalText: {
    fontSize: 10,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingWL: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.body,
  },
  bottomBar: {
    borderTopWidth: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
  },
  bottomBarButton: {
    width: '100%',
  },
});

export default PlayerProfileScreen;
