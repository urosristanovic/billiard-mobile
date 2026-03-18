import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '@/services/group';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { QUERY_KEYS } from '@/config/queryKeys';
import type { CreateGroupInput, UpdateGroupInput } from '@/types/group';

export const useMyGroups = () => {
  return useQuery({
    queryKey: QUERY_KEYS.GROUPS,
    queryFn: async () => {
      const token = await getAccessToken();
      return groupService.list(token);
    },
  });
};

export const useGroupDetail = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.GROUP_DETAIL(id),
    queryFn: async () => {
      const token = await getAccessToken();
      return groupService.getById(token, id);
    },
    enabled: !!id,
  });
};

export const useGroupMembers = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.GROUP_MEMBERS(id),
    queryFn: async () => {
      const token = await getAccessToken();
      return groupService.getMembers(token, id);
    },
    enabled: !!id,
  });
};

export const useGroupMutations = () => {
  const qc = useQueryClient();

  const createGroup = useMutation({
    mutationFn: async (input: CreateGroupInput) => {
      const token = await getAccessToken();
      return groupService.create(token, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS }),
  });

  const updateGroup = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateGroupInput }) => {
      const token = await getAccessToken();
      return groupService.update(token, id, input);
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_DETAIL(id) });
    },
  });

  const deleteGroup = useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessToken();
      return groupService.delete(token, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.GROUPS }),
  });

  const addMember = useMutation({
    mutationFn: async ({ groupId, userId, role }: { groupId: string; userId: string; role?: string }) => {
      const token = await getAccessToken();
      return groupService.addMember(token, groupId, userId, role);
    },
    onSuccess: (_, { groupId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_MEMBERS(groupId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_DETAIL(groupId) });
      qc.invalidateQueries({ queryKey: ['leaderboard'] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARDS });
    },
  });

  const removeMember = useMutation({
    mutationFn: async ({ groupId, userId }: { groupId: string; userId: string }) => {
      const token = await getAccessToken();
      return groupService.removeMember(token, groupId, userId);
    },
    onSuccess: (_, { groupId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_MEMBERS(groupId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.GROUP_DETAIL(groupId) });
      qc.invalidateQueries({ queryKey: ['leaderboard'] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOM_LEADERBOARDS });
    },
  });

  return { createGroup, updateGroup, deleteGroup, addMember, removeMember };
};
