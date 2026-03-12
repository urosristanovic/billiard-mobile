import { useInfiniteQuery } from '@tanstack/react-query';
import { matchService } from '@/services/match';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { useAuth } from '@/features/auth/useAuth';
import { QUERY_KEYS } from '@/config/queryKeys';
import type { MatchListParams } from '@/types/match';

export const useMatches = (params?: MatchListParams) => {
  const { user } = useAuth();
  const requestParams: MatchListParams = {
    ...params,
    pageSize: params?.pageSize ?? 20,
  };

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.MATCHES_LIST(requestParams as Record<string, unknown>),
    initialPageParam: requestParams.page ?? 1,
    queryFn: async ({ pageParam }) => {
      const token = await getAccessToken();
      return matchService.list(token, {
        ...requestParams,
        page: pageParam,
      });
    },
    getNextPageParam: lastPage =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!user,
  });
};
