import { useQuery } from '@tanstack/react-query';
import { matchService } from '@/services/match';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { useAuth } from '@/features/auth/useAuth';
import { QUERY_KEYS } from '@/config/queryKeys';

export const useMatchDetail = (matchId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.MATCH_DETAIL(matchId),
    queryFn: async () => {
      const token = await getAccessToken();
      return matchService.get(token, matchId);
    },
    enabled: !!user && !!matchId,
  });
};
