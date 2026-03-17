import { useQuery } from '@tanstack/react-query';
import { ratingService } from '@/services/rating';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { useAuth } from '@/features/auth/useAuth';
import { QUERY_KEYS } from '@/config/queryKeys';
import type { Discipline } from '@/types/match';

export const usePlayerRatings = (userId?: string) => {
  const { user } = useAuth();
  const targetId = userId ?? user?.id;

  return useQuery({
    queryKey: QUERY_KEYS.RATINGS(targetId ?? ''),
    queryFn: async () => {
      const token = await getAccessToken();
      return ratingService.getByUser(token, targetId!);
    },
    enabled: !!targetId,
  });
};

export const useRatingHistory = (userId?: string, discipline?: Discipline) => {
  const { user } = useAuth();
  const targetId = userId ?? user?.id;

  return useQuery({
    queryKey: QUERY_KEYS.RATINGS_HISTORY(targetId ?? '', discipline),
    queryFn: async () => {
      const token = await getAccessToken();
      return ratingService.getHistory(token, targetId!, discipline);
    },
    enabled: !!targetId,
  });
};
