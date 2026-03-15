import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/common/toast';
import { tournamentService } from '@/services/tournament';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { useAuth } from '@/features/auth/useAuth';
import { QUERY_KEYS } from '@/config/queryKeys';
import type {
  CreateTournamentInput,
  UpdateTournamentInput,
  RespondToRequestInput,
} from '@/types/tournament';

export const useTournamentMutations = () => {
  const { t } = useTranslation('common');
  const { t: tT } = useTranslation('tournaments');
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : t('error');

  const invalidateTournaments = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOURNAMENTS });
  };

  const createTournament = useMutation({
    mutationFn: async (input: CreateTournamentInput) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return tournamentService.create(token, input);
    },
    onSuccess: () => {
      invalidateTournaments();
      showToast({
        type: 'success',
        title: t('successTitle'),
        message: tT('create.createSuccess'),
      });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const updateTournament = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateTournamentInput;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return tournamentService.update(token, id, input);
    },
    onSuccess: tournament => {
      queryClient.setQueryData(
        QUERY_KEYS.TOURNAMENT_DETAIL(tournament.id),
        tournament,
      );
      invalidateTournaments();
      showToast({
        type: 'success',
        title: t('successTitle'),
        message: tT('edit.updateSuccess'),
      });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const publishTournament = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return tournamentService.publish(token, id);
    },
    onSuccess: t => {
      queryClient.setQueryData(QUERY_KEYS.TOURNAMENT_DETAIL(t.id), t);
      invalidateTournaments();
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const startTournament = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return tournamentService.start(token, id);
    },
    onSuccess: tournament => {
      queryClient.setQueryData(
        QUERY_KEYS.TOURNAMENT_DETAIL(tournament.id),
        tournament,
      );
      invalidateTournaments();
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const completeTournament = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return tournamentService.complete(token, id);
    },
    onSuccess: tournament => {
      queryClient.setQueryData(
        QUERY_KEYS.TOURNAMENT_DETAIL(tournament.id),
        tournament,
      );
      invalidateTournaments();
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const cancelTournament = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return tournamentService.cancel(token, id);
    },
    onSuccess: tournament => {
      queryClient.setQueryData(
        QUERY_KEYS.TOURNAMENT_DETAIL(tournament.id),
        tournament,
      );
      invalidateTournaments();
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const invitePlayer = useMutation({
    mutationFn: async ({
      tournamentId,
      userId,
    }: {
      tournamentId: string;
      userId: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return tournamentService.invite(token, tournamentId, userId);
    },
    onSuccess: (_req, { tournamentId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TOURNAMENT_REQUESTS(tournamentId),
      });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const requestSpot = useMutation({
    mutationFn: async (tournamentId: string) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return tournamentService.requestSpot(token, tournamentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TOURNAMENTS_MY_PENDING,
      });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  const respondToRequest = useMutation({
    mutationFn: async ({
      tournamentId,
      requestId,
      input,
    }: {
      tournamentId: string;
      requestId: string;
      input: RespondToRequestInput;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const token = await getAccessToken();
      return tournamentService.respondToRequest(
        token,
        tournamentId,
        requestId,
        input,
      );
    },
    onSuccess: (_req, { tournamentId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TOURNAMENT_DETAIL(tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TOURNAMENT_REQUESTS(tournamentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TOURNAMENTS_MY_PENDING,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TOURNAMENTS_MY });
    },
    onError: error =>
      showToast({
        type: 'error',
        title: t('errorTitle'),
        message: getErrorMessage(error),
      }),
  });

  return {
    createTournament,
    updateTournament,
    publishTournament,
    startTournament,
    completeTournament,
    cancelTournament,
    invitePlayer,
    requestSpot,
    respondToRequest,
  };
};
