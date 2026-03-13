import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tournamentService } from '@/services/tournament';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { useAuth } from '@/features/auth/useAuth';
import { QUERY_KEYS } from '@/config/queryKeys';
import { useMyPendingRequests, useMyTournaments } from './useTournaments';
import type { TournamentRequestStatus } from '@/types/tournament';

export const useBrowseTournaments = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');

  const result = useQuery({
    queryKey: QUERY_KEYS.TOURNAMENTS_SEARCH(query),
    queryFn: async () => {
      const token = await getAccessToken();
      return tournamentService.search(token, query);
    },
    enabled: !!user && query.length >= 2,
  });

  const { data: pendingRequests = [] } = useMyPendingRequests();
  const { data: myData } = useMyTournaments();

  const myRequestStatusMap = useMemo(() => {
    const map: Record<string, TournamentRequestStatus> = {};
    pendingRequests.forEach(req => {
      if (req.direction === 'request') {
        map[req.tournamentId] = req.status;
      }
    });
    return map;
  }, [pendingRequests]);

  const participatingIds = useMemo(() => {
    const all = [...(myData?.active ?? []), ...(myData?.past ?? [])];
    return new Set(all.map(t => t.id));
  }, [myData]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
  }, []);

  return {
    ...result,
    query,
    handleSearch,
    tournaments: result.data?.data ?? [],
    myRequestStatusMap,
    participatingIds,
  };
};
