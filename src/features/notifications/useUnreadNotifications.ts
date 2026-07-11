import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/useAuth';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { notificationService } from '@/services/notification';
import { QUERY_KEYS } from '@/config/queryKeys';

/**
 * Returns whether the user has any unread notifications.
 * Backed by a lightweight server query; invalidated on AppState resume.
 */
export const useUnreadNotifications = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT,
    queryFn: async () => {
      const token = await getAccessToken();
      return notificationService.unreadCount(token);
    },
    enabled: !!user,
    staleTime: 10_000,
    refetchInterval: 15_000,
  });

  return {
    hasUnread: (query.data ?? 0) > 0,
    unreadCount: query.data ?? 0,
  };
};
