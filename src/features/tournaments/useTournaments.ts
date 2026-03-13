import { useQuery } from '@tanstack/react-query';
import { tournamentService } from '@/services/tournament';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { useAuth } from '@/features/auth/useAuth';
import { QUERY_KEYS } from '@/config/queryKeys';

export const useMyTournaments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.TOURNAMENTS_MY,
    queryFn: async () => {
      const token = await getAccessToken();
      return tournamentService.my(token);
    },
    enabled: !!user,
  });
};

export const useMyPendingRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.TOURNAMENTS_MY_PENDING,
    queryFn: async () => {
      const token = await getAccessToken();
      return tournamentService.myPending(token);
    },
    enabled: !!user,
  });
};
