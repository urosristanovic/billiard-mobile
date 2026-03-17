import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/queryKeys';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { challengeService } from '@/services/challenge';
import type { CreateChallengeInput } from '@/types';

export const useMyChallenges = (status?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.CHALLENGES, status] as const,
    queryFn: async () => {
      const token = await getAccessToken();
      return challengeService.list(token, status);
    },
  });

export const useChallengeDetail = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.CHALLENGE_DETAIL(id),
    queryFn: async () => {
      const token = await getAccessToken();
      return challengeService.getById(token, id);
    },
    enabled: !!id,
  });

export const useChallengeMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHALLENGES });
  };

  const createChallenge = useMutation({
    mutationFn: async (input: CreateChallengeInput) => {
      const token = await getAccessToken();
      return challengeService.create(token, input);
    },
    onSuccess: invalidate,
  });

  const acceptChallenge = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessToken();
      return challengeService.accept(token, id);
    },
    onSuccess: invalidate,
  });

  const declineChallenge = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const token = await getAccessToken();
      return challengeService.decline(token, id, reason);
    },
    onSuccess: invalidate,
  });

  const cancelChallenge = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessToken();
      return challengeService.cancel(token, id);
    },
    onSuccess: invalidate,
  });

  return { createChallenge, acceptChallenge, declineChallenge, cancelChallenge };
};
