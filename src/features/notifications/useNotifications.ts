import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/useAuth';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { notificationService } from '@/services/notification';
import { QUERY_KEYS } from '@/config/queryKeys';
import type { AppNotification } from '@/types/notification';
import type { PaginatedResponse } from '@/types/api';
import type { InfiniteData } from '@tanstack/react-query';

const PAGE_SIZE = 20;

export const useNotifications = () => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS_LIST,
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

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getAccessToken();
      return notificationService.markAllRead(token);
    },
    onSuccess: () => {
      // Write the read state directly instead of only invalidating, so the
      // "unread" UI (e.g. the mark-all button) updates in the same tick the
      // mutation settles rather than flashing stale data until a refetch lands.
      const now = new Date().toISOString();
      queryClient.setQueryData<InfiniteData<PaginatedResponse<AppNotification>>>(
        QUERY_KEYS.NOTIFICATIONS_LIST,
        old => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map(page => ({
              ...page,
              data: page.data.map(n => (n.readAt ? n : { ...n, readAt: now })),
            })),
          };
        },
      );
      queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT, 0);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT,
      });
    },
  });
};
