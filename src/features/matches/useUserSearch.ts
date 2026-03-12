import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user';
import type { UserSearchResult } from '@/services/user';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { useAuth } from '@/features/auth/useAuth';
import { useOpponents } from '@/features/matches/useOpponents';
import { getOpponentLabel } from '@/features/matches/opponentLabel';
import { QUERY_KEYS } from '@/config/queryKeys';

export const useUserSearch = (excludeId?: string) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim();
  const isSearchMode = normalizedQuery.length >= 2;
  const { data: suggestedOpponents = [], isFetching: isFetchingSuggestions } =
    useOpponents();

  const { data: searchedUsers = [], isFetching: isFetchingSearch } = useQuery({
    queryKey: [...QUERY_KEYS.USER_SEARCH(query), excludeId],
    queryFn: async () => {
      const token = await getAccessToken();
      return userService.search(token, query, excludeId);
    },
    enabled: !!user && isSearchMode,
    staleTime: 30_000,
  });

  const suggestions: UserSearchResult[] = suggestedOpponents
    .filter(opponent => opponent.id !== excludeId)
    .map(opponent => ({
      id: opponent.id,
      username: opponent.username,
      displayName: getOpponentLabel(opponent),
      avatarUrl: opponent.avatarUrl,
      location: null,
    }));

  const results = isSearchMode ? searchedUsers : suggestions;
  const isFetching = isSearchMode ? isFetchingSearch : isFetchingSuggestions;

  return {
    query,
    setQuery,
    results,
    isFetching,
    isSearchMode,
    suggestions,
    searchedUsers,
    isFetchingSuggestions,
    isFetchingSearch,
  };
};
