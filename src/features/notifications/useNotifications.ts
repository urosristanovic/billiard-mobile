import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/useAuth';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { notificationService } from '@/services/notification';
import { QUERY_KEYS } from '@/config/queryKeys';

const PAGE_SIZE = 20;

export const useNotifications = () => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS_LIST(1),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const token = await getAccessToken();
      return notificationService.list(token, {
        page: pageParam,
        pageSize: PAGE_SIZE,
      });
    },
    getNextPageParam: lastPage =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!user,
    staleTime: 30_000,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessToken();
      return notificationService.markRead(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT,
      });
    },
  });
};
