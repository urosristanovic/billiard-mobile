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
    mutationFn: async (matchId: string) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return matchService.cancel(token, matchId);
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

  const rejectDispute = useMutation({
    mutationFn: async (matchId: string) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return matchService.rejectDispute(token, matchId);
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
    confirmMatch,
    disputeMatch,
    cancelMatch,
    acceptDispute,
    rejectDispute,
  };
};
