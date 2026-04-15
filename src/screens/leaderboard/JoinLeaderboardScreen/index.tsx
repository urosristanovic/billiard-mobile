import { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { ScreenLayout, ScreenHeader } from '@/components/common/layout';
import { Input } from '@/components/common/forms';
import { EmptyState, Loading } from '@/components/common/states';
import {
  useBrowseLeaderboards,
  useJoinLeaderboard,
} from '@/features/leaderboard/useCustomLeaderboards';
import { typography, spacing } from '@/constants/theme';
import type { LeaderboardStackParamList } from '@/navigation/AppNavigator';
import { LeaderboardBrowseCard } from './components';

type Props = NativeStackScreenProps<LeaderboardStackParamList, 'JoinLeaderboard'>;

const JoinLeaderboardScreen = ({ navigation }: Props) => {
  const { t } = useTranslation('leaderboard');
  const { isDark, tk } = useTheme();

  const [searchText, setSearchText] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: results = [], isLoading } = useBrowseLeaderboards(
    debouncedQuery || undefined,
  );
  const joinMutation = useJoinLeaderboard();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = searchText.trim();
      if (trimmed.length >= 2 || trimmed === '') {
        setDebouncedQuery(trimmed);
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText]);

  const isSearching = debouncedQuery.length >= 2;

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
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          !isSearching && results.length > 0 ? (
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
          ) : isSearching ? (
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
          <LeaderboardBrowseCard
            leaderboard={item}
            isDark={isDark}
            isJoining={joinMutation.isPending && joinMutation.variables === item.id}
            onJoin={() => joinMutation.mutate(item.id)}
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

export default JoinLeaderboardScreen;
