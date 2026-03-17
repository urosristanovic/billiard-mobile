import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customLeaderboardService } from '@/services/customLeaderboard';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { QUERY_KEYS } from '@/config/queryKeys';
import type { CreateCustomLeaderboardInput, UpdateCustomLeaderboardInput } from '@/types/group';

export const useMyCustomLeaderboards = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOM_LEADERBOARDS,
    queryFn: async () => {
      const token = await getAccessToken();
      return customLeaderboardService.list(token);
    },
  });
};

export const useCustomLeaderboardDetail = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOM_LEADERBOARD_DETAIL(id),
    queryFn: async () => {
      const token = await getAccessToken();
      return customLeaderboardService.getById(token, id);
    },
    enabled: !!id,
  });
};

export const useCustomLeaderboardMembers = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOM_LEADERBOARD_MEMBERS(id),
    queryFn: async () => {
      const token = await getAccessToken();
      return customLeaderboardService.getMembers(token, id);
    },
    enabled: !!id,
  });
};

export const useCustomLeaderboardMutations = () => {
  const qc = useQueryClient();

  const createLeaderboard = useMutation({
    mutationFn: async (input: CreateCustomLeaderboardInput) => {
      const token = await getAccessToken();
      return customLeaderboardService.create(token, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARDS }),
  });

  const updateLeaderboard = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateCustomLeaderboardInput }) => {
      const token = await getAccessToken();
      return customLeaderboardService.update(token, id, input);
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARDS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARD_DETAIL(id) });
    },
  });

  const deleteLeaderboard = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessToken();
      return customLeaderboardService.delete(token, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARDS }),
  });

  const addMember = useMutation({
    mutationFn: async ({ leaderboardId, userId }: { leaderboardId: string; userId: string }) => {
      const token = await getAccessToken();
      return customLeaderboardService.addMember(token, leaderboardId, userId);
    },
    onSuccess: (_, { leaderboardId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARD_MEMBERS(leaderboardId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARD_DETAIL(leaderboardId) });
    },
  });

  const removeMember = useMutation({
    mutationFn: async ({ leaderboardId, userId }: { leaderboardId: string; userId: string }) => {
      const token = await getAccessToken();
      return customLeaderboardService.removeMember(token, leaderboardId, userId);
    },
    onSuccess: (_, { leaderboardId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARD_MEMBERS(leaderboardId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARD_DETAIL(leaderboardId) });
    },
  });

  return { createLeaderboard, updateLeaderboard, deleteLeaderboard, addMember, removeMember };
};
