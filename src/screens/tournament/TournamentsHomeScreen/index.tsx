import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout } from '@/components/common/layout';
import { PrimaryButton } from '@/components/common/buttons';
import { EmptyState, LoadingState } from '@/components/common/states';
import {
  useMyTournaments,
  useMyPendingRequests,
} from '@/features/tournaments/useTournaments';
import { TournamentCard, PendingRequestCard } from './components';
import { styles } from './styles';
import type { TournamentsStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<
  TournamentsStackParamList,
  'TournamentsHome'
>;

const TournamentsHomeScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('tournaments');
  const { isDark, tk } = useTheme();

  const { data: myData, isLoading, isRefetching, refetch } = useMyTournaments();

  const {
    data: pendingRequests = [],
    isRefetching: isPendingRefetching,
    refetch: refetchPending,
  } = useMyPendingRequests();

  const active = myData?.active ?? [];
  const past = myData?.past ?? [];
  const stats = myData?.stats ?? { active: 0, won: 0 };

  const handleRefresh = () => {
    refetch();
    refetchPending();
  };

  return (
    <ScreenLayout isDark={isDark}>
      {/* Fixed top block */}
      <View
        style={[styles.stickyHeader, { borderBottomColor: tk.border.subtle }]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: tk.text.primary }]}>
            {t('home.title')}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <PrimaryButton
            label={t('home.createButton')}
            onPress={() => navigation.navigate('CreateTournament')}
            isDark={isDark}
            compact
            style={styles.actionButton}
          />
          <PrimaryButton
            label={t('home.joinButton')}
            onPress={() => navigation.navigate('BrowseTournaments')}
            isDark={isDark}
            compact
            style={styles.actionButton}
          />
        </View>

        <View
          style={[
            styles.statsContainer,
            {
              backgroundColor: tk.surface.raised,
              borderColor: tk.border.default,
            },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: tk.text.primary }]}>
              {stats.active}
            </Text>
            <Text style={[styles.statLabel, { color: tk.text.secondary }]}>
              {t('home.stats.active')}
            </Text>
          </View>
          <View
            style={[
              styles.statItem,
              { borderLeftWidth: 1, borderLeftColor: tk.border.subtle },
            ]}
          >
            <Text style={[styles.statValue, { color: tk.primary[400] }]}>
              {stats.won}
            </Text>
            <Text style={[styles.statLabel, { color: tk.text.secondary }]}>
              {t('home.stats.won')}
            </Text>
          </View>
        </View>
      </View>

      {/* Scrollable list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || isPendingRefetching}
            onRefresh={handleRefresh}
            tintColor={tk.primary[400]}
          />
        }
      >
        {/* Refetch indicator */}
        {isRefetching &&
          !isLoading &&
          (active.length > 0 || past.length > 0) && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
              }}
            >
              <ActivityIndicator size='small' color={tk.primary[600]} />
            </View>
          )}

        {/* Pending requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: tk.text.muted }]}>
              {t('home.pending.title')}
            </Text>
            <View style={styles.cardList}>
              {pendingRequests.map(req => (
                <PendingRequestCard
                  key={req.id}
                  request={req}
                  onPress={() =>
                    navigation.navigate('InvitationDetail', {
                      requestId: req.id,
                    })
                  }
                  isDark={isDark}
                />
              ))}
            </View>
          </View>
        )}

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: tk.border.subtle }]} />

        {/* Active tournaments */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: tk.text.muted }]}>
            {t('home.active.title')}
          </Text>
          {isLoading ? (
            <LoadingState message={t('loading')} isDark={isDark} />
          ) : active.length === 0 ? (
            <EmptyState
              title={t('home.active.empty')}
              description={t('home.active.emptyDesc')}
              isDark={isDark}
            />
          ) : (
            <View style={styles.cardList}>
              {active.map(tournament => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onPress={() =>
                    navigation.navigate('TournamentDetail', {
                      tournamentId: tournament.id,
                    })
                  }
                  isDark={isDark}
                />
              ))}
            </View>
          )}
        </View>

        {/* Past tournaments */}
        {past.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: tk.text.muted }]}>
              {t('home.past.title')}
            </Text>
            <View style={styles.cardList}>
              {past.map(tournament => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onPress={() =>
                    navigation.navigate('TournamentDetail', {
                      tournamentId: tournament.id,
                    })
                  }
                  isDark={isDark}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
};

export default TournamentsHomeScreen;
