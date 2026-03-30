import { useQuery } from '@tanstack/react-query';
import { tournamentService } from '@/services/tournament';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { useAuth } from '@/features/auth/useAuth';
import { QUERY_KEYS } from '@/config/queryKeys';

export const useTournamentDetail = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.TOURNAMENT_DETAIL(id),
    queryFn: async () => {
      const token = await getAccessToken();
      return tournamentService.get(token, id);
    },
    enabled: !!user && !!id,
  });
};

export const useTournamentRequests = (tournamentId: string, enabled = true) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.TOURNAMENT_REQUESTS(tournamentId),
    queryFn: async () => {
      const token = await getAccessToken();
      return tournamentService.getRequests(token, tournamentId);
    },
    enabled: !!user && !!tournamentId && enabled,
  });
};

export const useStandings = (tournamentId: string, enabled = true) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.TOURNAMENT_STANDINGS(tournamentId),
    queryFn: async () => {
      const token = await getAccessToken();
      return tournamentService.getStandings(token, tournamentId);
    },
    enabled: !!user && !!tournamentId && enabled,
  });
};
