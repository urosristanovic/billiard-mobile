import { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/useAuth';
import { ScreenLayout } from '@/components/common/layout';
import { EmptyState } from '@/components/common/states';
import { useBrowseTournaments } from '@/features/tournaments/useBrowseTournaments';
import { useTournamentMutations } from '@/features/tournaments/useTournamentMutations';
import { TournamentSearchCard } from './components';
import { typography, spacing, radius } from '@/constants/theme';
import type { TournamentsStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<TournamentsStackParamList, 'BrowseTournaments'>;

const BrowseTournamentsScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('tournaments');
  const { isDark, tk } = useTheme();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { tournaments, isLoading, query, handleSearch, myRequestStatusMap, participatingIds } =
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
      <View style={[styles.header, { borderBottomColor: tk.border.subtle }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole='button'
        >
          <Text style={[styles.back, { color: tk.primary[400] }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: tk.text.primary }]}>
          {t('browse.title')}
        </Text>
        <View style={styles.backPlaceholder} />
      </View>

      {/* Search bar */}
      <View style={[styles.searchBar, { borderColor: tk.border.default }]}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder={t('browse.searchPlaceholder')}
          placeholderTextColor={tk.text.muted}
          returnKeyType='search'
          style={[
            styles.searchInput,
            {
              backgroundColor: tk.surface.raised,
              color: tk.text.primary,
              borderColor: tk.border.default,
            },
          ]}
        />
      </View>

      <FlatList
        data={tournaments}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={tk.primary[400]} />
            </View>
          ) : query.length < 2 ? (
            <EmptyState
              title={t('browse.emptyInitial')}
              description={t('browse.emptyInitialDesc')}
              isDark={isDark}
            />
          ) : (
            <EmptyState
              title={t('browse.empty')}
              description={t('browse.emptyDesc')}
              isDark={isDark}
            />
          )
        }
        renderItem={({ item }) => (
          <TournamentSearchCard
            tournament={item}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
  },
  back: {
    fontSize: 22,
    fontFamily: typography.family.display,
    width: 32,
  },
  backPlaceholder: {
    width: 32,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.size.lg,
    fontFamily: typography.family.display,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  searchBar: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  searchInput: {
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    fontSize: typography.size.base,
    fontFamily: typography.family.body,
  },
  list: {
    padding: spacing[4],
    gap: spacing[3],
    paddingBottom: spacing[8],
  },
  loadingRow: {
    paddingVertical: spacing[8],
    alignItems: 'center',
  },
});

export default BrowseTournamentsScreen;
