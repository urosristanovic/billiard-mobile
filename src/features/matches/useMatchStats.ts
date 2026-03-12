import { useQuery } from '@tanstack/react-query';
import { matchService } from '@/services/match';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { useAuth } from '@/features/auth/useAuth';
import { QUERY_KEYS } from '@/config/queryKeys';
import type { MatchListParams } from '@/types/match';

export const useMatchStats = (params?: MatchListParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.MATCH_STATS(params ?? {}),
    queryFn: async () => {
      const token = await getAccessToken();
      return matchService.stats(token, params);
    },
    enabled: !!user,
  });
};
