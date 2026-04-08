import { useState, useEffect } from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { iconSize } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout, AppHeader } from '@/components/common/layout';
import { FloatingActionButton } from '@/components/common/buttons/FloatingActionButton';
import { GhostButton } from '@/components/common/buttons';
import { EmptyState, LoadingState } from '@/components/common/states';
import { TabBar } from '@/components/common';
import {
  useMyTournaments,
  useMyPendingRequests,
} from '@/features/tournaments/useTournaments';
import {
  TournamentCard,
  PendingRequestCard,
  TournamentStatsRow,
} from './components';
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

  const [tab, setTab] = useState<'pending' | 'active' | 'past'>('active');

  useEffect(() => {
    if (pendingRequests.length > 0) {
      setTab('pending');
    }
  }, [pendingRequests.length]);

  const handleRefresh = () => {
    refetch();
    refetchPending();
  };

  return (
    <ScreenLayout isDark={isDark}>
      {/* Fixed top block */}
      <View style={styles.stickyHeader}>
        <AppHeader />
        <TournamentStatsRow stats={stats} isDark={isDark} />
        <View style={styles.tabRow}>
          <TabBar
            tabs={[
              { key: 'pending', label: t('home.pending.title') },
              { key: 'active', label: t('home.active.title') },
              { key: 'past', label: t('home.past.title') },
            ]}
            activeTab={tab}
            onTabChange={setTab}
            style={{ flex: 1 }}
          />
          <View style={styles.tabCreateBtn}>
            <GhostButton
              label={t('home.createButton')}
              // label={t('home.createButton')}
              icon={
                <Feather
                  name='award'
                  size={iconSize.sm}
                  color={tk.primary[500]}
                />
              }
              isDark={isDark}
              onPress={() => navigation.navigate('CreateTournament')}
              size='sm'
            />
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
        {/* Tab content */}
        <View style={styles.section}>
          {tab === 'pending' ? (
            pendingRequests.length === 0 ? (
              <EmptyState
                title={t('home.pending.empty')}
                description={t('home.pending.emptyDesc')}
                isDark={isDark}
              />
            ) : (
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
            )
          ) : tab === 'active' ? (
            isLoading ? (
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
            )
          ) : past.length === 0 ? (
            <EmptyState
              title={t('home.past.empty')}
              description={t('home.past.emptyDesc')}
              isDark={isDark}
            />
          ) : (
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
          )}
        </View>
      </ScrollView>

      <View style={styles.fabRow}>
        <View style={{ flex: 1 }} />
        <FloatingActionButton
          label={t('home.joinButton')}
          icon={
            <Feather name='plus' size={iconSize.md} color={tk.text.onPrimary} />
          }
          onPress={() => navigation.navigate('BrowseTournaments')}
          style={{ flex: 1 }}
        />
      </View>
    </ScreenLayout>
  );
};

export default TournamentsHomeScreen;
