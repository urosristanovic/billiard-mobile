import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customLeaderboardService } from '@/services/customLeaderboard';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { QUERY_KEYS } from '@/config/queryKeys';
import { useAuthStore } from '@/stores/useAuthStore';
import { authService } from '@/services/auth';
import type {
  BrowseLeaderboardResult,
  CreateCustomLeaderboardInput,
  GroupMember,
  UpdateCustomLeaderboardInput,
} from '@/types/group';

// ── List / browse ─────────────────────────────────────────────────────────────

export const useMyCustomLeaderboards = (visibility?: 'public' | 'private') => {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOM_LEADERBOARDS_LIST(visibility),
    queryFn: async () => {
      const token = await getAccessToken();
      return customLeaderboardService.list(token, visibility);
    },
  });
};

export const useBrowseLeaderboards = (query?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.LEADERBOARDS_BROWSE(query ?? ''),
    queryFn: async () => {
      const token = await getAccessToken();
      return customLeaderboardService.search(token, query);
    },
  });
};

// ── Detail / members ──────────────────────────────────────────────────────────

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

export const usePendingMembers = (leaderboardId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOM_LEADERBOARD_PENDING(leaderboardId),
    queryFn: async () => {
      const token = await getAccessToken();
      return customLeaderboardService.getPendingMembers(token, leaderboardId);
    },
    enabled: !!leaderboardId,
  });
};

// ── CRUD mutations ────────────────────────────────────────────────────────────

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
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARD_PENDING(leaderboardId) });
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

// ── Join / leave ──────────────────────────────────────────────────────────────

export const useJoinLeaderboard = () => {
  const qc = useQueryClient();
  const setUser = useAuthStore(s => s.setUser);
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessToken();
      return customLeaderboardService.join(token, id);
    },
    onSuccess: async (result) => {
      // Invalidate the user's leaderboard list so the new entry appears
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARDS });
      // Refresh browse results so isMember / isPending flags update
      qc.invalidateQueries({ queryKey: ['custom-leaderboards', 'browse'] });
      // If the user became an active member, refresh the auth profile so
      // defaultLeaderboardId reflects any auto-default set by the server
      if (result.status === 'active') {
        const updatedUser = await authService.me();
        setUser(updatedUser);
      }
    },
  });
};

export const useLeaveLeaderboard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessToken();
      return customLeaderboardService.leave(token, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARDS });
      qc.invalidateQueries({ queryKey: ['custom-leaderboards', 'browse'] });
    },
  });
};

// ── Pending request actions ───────────────────────────────────────────────────

export const useRespondToPending = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      leaderboardId,
      userId,
      action,
    }: {
      leaderboardId: string;
      userId: string;
      action: 'accept' | 'decline';
    }) => {
      const token = await getAccessToken();
      return customLeaderboardService.respondToPending(token, leaderboardId, userId, action);
    },
    onSuccess: (_, { leaderboardId, userId, action }) => {
      // Grab the accepted member from the pending cache before removing them
      const pendingSnapshot = qc.getQueryData<GroupMember[]>(
        QUERY_KEYS.CUSTOM_LEADERBOARD_PENDING(leaderboardId),
      );
      const resolvedMember = pendingSnapshot?.find(m => m.userId === userId);

      // Instantly remove from the pending list
      qc.setQueryData<GroupMember[]>(
        QUERY_KEYS.CUSTOM_LEADERBOARD_PENDING(leaderboardId),
        (old = []) => old.filter(m => m.userId !== userId),
      );

      // Instantly add to the members list when accepted
      if (action === 'accept' && resolvedMember) {
        qc.setQueryData<GroupMember[]>(
          QUERY_KEYS.CUSTOM_LEADERBOARD_MEMBERS(leaderboardId),
          (old = []) => [
            ...old,
            { ...resolvedMember, role: 'member' as const, joinedAt: new Date().toISOString() },
          ],
        );
      }

      // Invalidate in the background so server data eventually reconciles
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARD_PENDING(leaderboardId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARD_MEMBERS(leaderboardId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARD_DETAIL(leaderboardId) });
      // Refresh the list so pendingCount badge updates
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARDS });
    },
  });
};

// ── Type re-export for consumers ──────────────────────────────────────────────
export type { BrowseLeaderboardResult };
