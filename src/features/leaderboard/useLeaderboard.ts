import { useInfiniteQuery } from '@tanstack/react-query';
import { leaderboardService } from '@/services/leaderboard';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { QUERY_KEYS } from '@/config/queryKeys';
import type { LeaderboardParams } from '@/types/rating';

const PAGE_SIZE = 50;

const isScopeReady = (params: Omit<LeaderboardParams, 'page'>): boolean => {
  switch (params.scope) {
    case 'global':  return true;
    case 'country': return !!params.countryId;
    case 'city':    return !!params.cityId;
    case 'group':   return !!params.groupId;
    case 'custom':  return !!params.leaderboardId;
    default:        return false;
  }
};

export const useLeaderboard = (params: Omit<LeaderboardParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.LEADERBOARD(params as Record<string, unknown>),
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getAccessToken();
      return leaderboardService.list(token, { ...params, page: pageParam as number, pageSize: PAGE_SIZE });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined,
    enabled: !!params.discipline && !!params.scope && isScopeReady(params),
  });
};
