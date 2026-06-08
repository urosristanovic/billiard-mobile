import { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/useAuth';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { Input } from '@/components/common/forms';
import { EmptyState, Loading } from '@/components/common/states';
import { useBrowseTournaments } from '@/features/tournaments/useBrowseTournaments';
import { useTournamentMutations } from '@/features/tournaments/useTournamentMutations';
import { TournamentSearchCard } from './components';
import { spacing, typography } from '@/constants/theme';
import type { TournamentsStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<TournamentsStackParamList, 'BrowseTournaments'>;

const BrowseTournamentsScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('tournaments');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { tournaments, isLoading, isFetching, refetch, query, handleSearch, myRequestStatusMap, participatingIds } =
    useBrowseTournaments();
  const { requestSpot } = useTournamentMutations();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = searchText.trim();
      if (trimmed.length >= 2 || trimmed === '') {
        handleSearch(trimmed);
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText, handleSearch]);

  const handleRequestSpot = (tournamentId: string) => {
    requestSpot.mutate(tournamentId, {
      onSuccess: () => {
        setRequestedIds(prev => new Set(prev).add(tournamentId));
      },
    });
  };

  return (
    <ScreenLayout isDark={isDark}>
      <ScreenHeader onBack={() => navigation.goBack()} title={t('browse.title')} />

      <View style={styles.searchBar}>
        <Input
          variant='search'
          value={searchText}
          onChangeText={setSearchText}
          placeholder={t('browse.searchPlaceholder')}
          returnKeyType='search'
        />
      </View>

      <FlatList
        data={tournaments}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor={tk.primary[400]}
            colors={[tk.primary[400]]}
            progressBackgroundColor={tk.background?.primary}
          />
        }
        ListHeaderComponent={
          query === '' && tournaments.length > 0 ? (
            <Text style={[styles.sectionTitle, { color: tk.text.muted }]}>
              {t('browse.suggested')}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingRow}>
              <Loading />
            </View>
          ) : query !== '' ? (
            <EmptyState
              title={t('browse.empty')}
              description={t('browse.emptyDesc')}
              isDark={isDark}
            />
          ) : (
            <EmptyState
              title={t('browse.emptyInitial')}
              description={t('browse.emptyInitialDesc')}
              isDark={isDark}
            />
          )
        }
        renderItem={({ item }) => (
          <TournamentSearchCard
            tournament={item}
            onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item.id })}
            onRequestSpot={() => handleRequestSpot(item.id)}
            isRequesting={
              requestSpot.isPending && requestSpot.variables === item.id
            }
            hasRequested={requestedIds.has(item.id)}
            myRequestStatus={myRequestStatusMap[item.id]}
            isOrganizer={user?.id === item.organizerId}
            isParticipant={participatingIds.has(item.id)}
            isDark={isDark}
          />
        )}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[1],
  },
  list: {
    padding: spacing[4],
    gap: spacing[3],
    paddingBottom: spacing[8],
  },
  sectionTitle: {
    fontSize: typography.size.xs,
    fontFamily: typography.family.heading,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[1],
  },
  loadingRow: {
    paddingVertical: spacing[8],
    alignItems: 'center',
  },
});

export default BrowseTournamentsScreen;
