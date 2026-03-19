import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/common/toast';
import { matchService } from '@/services/match';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { useAuth } from '@/features/auth/useAuth';
import { QUERY_KEYS } from '@/config/queryKeys';
import type { PaginatedResponse } from '@/types/api';
import type { CreateMatchInput, DisputeMatchInput, Match } from '@/types/match';

export const useMatchMutations = () => {
  const { t } = useTranslation('common');
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : t('error');

  const updateMatchInCachedLists = (updatedMatch: Match) => {
    queryClient.setQueriesData(
      { queryKey: QUERY_KEYS.MATCHES_LIST_BASE },
      (oldData: InfiniteData<PaginatedResponse<Match>, number> | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: page.data.map(match =>
              match.id === updatedMatch.id ? updatedMatch : match,
            ),
          })),
        };
      },
    );
  };

  const removeMatchFromCachedLists = (matchId: string) => {
    queryClient.setQueriesData(
      { queryKey: QUERY_KEYS.MATCHES_LIST_BASE },
      (oldData: InfiniteData<PaginatedResponse<Match>, number> | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: page.data.filter(match => match.id !== matchId),
            total: Math.max(0, page.total - (page.data.some(m => m.id === matchId) ? 1 : 0)),
          })),
        };
      },
    );
  };

  const createMatch = useMutation({
    mutationFn: async (input: CreateMatchInput) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return matchService.create(token, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATCHES });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const createChallenge = useMutation({
    mutationFn: async (input: {
      opponentId: string;
      discipline: CreateMatchInput['discipline'];
      bestOf?: number;
      message?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return matchService.createChallenge(token, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATCHES });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const confirmMatch = useMutation({
    mutationFn: async (matchId: string) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return matchService.confirm(token, matchId);
    },
    onSuccess: match => {
      queryClient.setQueryData(QUERY_KEYS.MATCH_DETAIL(match.id), match);
      updateMatchInCachedLists(match);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATCHES });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const disputeMatch = useMutation({
    mutationFn: async ({
      matchId,
      input,
    }: {
      matchId: string;
      input: DisputeMatchInput;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return matchService.dispute(token, matchId, input);
    },
    onSuccess: match => {
      queryClient.setQueryData(QUERY_KEYS.MATCH_DETAIL(match.id), match);
      updateMatchInCachedLists(match);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATCHES });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const cancelMatch = useMutation({
    mutationFn: async ({
      matchId,
      reason,
    }: {
      matchId: string;
      reason?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return matchService.cancel(token, matchId, reason);
    },
    onSuccess: match => {
      queryClient.setQueryData(QUERY_KEYS.MATCH_DETAIL(match.id), match);
      updateMatchInCachedLists(match);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATCHES });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const acceptDispute = useMutation({
    mutationFn: async (matchId: string) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return matchService.acceptDispute(token, matchId);
    },
    onSuccess: match => {
      queryClient.setQueryData(QUERY_KEYS.MATCH_DETAIL(match.id), match);
      updateMatchInCachedLists(match);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATCHES });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const counterDispute = useMutation({
    mutationFn: async ({
      matchId,
      input,
    }: {
      matchId: string;
      input: DisputeMatchInput;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return matchService.counterDispute(token, matchId, input);
    },
    onSuccess: match => {
      queryClient.setQueryData(QUERY_KEYS.MATCH_DETAIL(match.id), match);
      updateMatchInCachedLists(match);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATCHES });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const acceptChallenge = useMutation({
    mutationFn: async (matchId: string) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return matchService.acceptChallenge(token, matchId);
    },
    onSuccess: match => {
      queryClient.setQueryData(QUERY_KEYS.MATCH_DETAIL(match.id), match);
      updateMatchInCachedLists(match);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATCHES });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const declineChallenge = useMutation({
    mutationFn: async ({ matchId, reason }: { matchId: string; reason?: string }) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return matchService.declineChallenge(token, matchId, reason);
    },
    onSuccess: match => {
      queryClient.setQueryData(QUERY_KEYS.MATCH_DETAIL(match.id), match);
      updateMatchInCachedLists(match);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATCHES });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const cancelChallengeRequest = useMutation({
    mutationFn: async (matchId: string) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      await matchService.cancelChallengeRequest(token, matchId);
      return matchId;
    },
    onSuccess: matchId => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.MATCH_DETAIL(matchId) });
      removeMatchFromCachedLists(matchId);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATCHES });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const recordChallenge = useMutation({
    mutationFn: async ({
      matchId,
      myScore,
      opponentScore,
      myBeers,
      opponentBeers,
    }: {
      matchId: string;
      myScore: number;
      opponentScore: number;
      myBeers?: number;
      opponentBeers?: number;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return matchService.record(token, matchId, { myScore, opponentScore, myBeers, opponentBeers });
    },
    onSuccess: match => {
      queryClient.setQueryData(QUERY_KEYS.MATCH_DETAIL(match.id), match);
      updateMatchInCachedLists(match);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MATCHES });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  return {
    createMatch,
    createChallenge,
    confirmMatch,
    disputeMatch,
    cancelMatch,
    acceptDispute,
    counterDispute,
    acceptChallenge,
    declineChallenge,
    cancelChallengeRequest,
    recordChallenge,
  };
};
