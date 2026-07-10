import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/useAuth';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { notificationService } from '@/services/notification';
import { QUERY_KEYS } from '@/config/queryKeys';
import type { NotificationCategory } from '@/types/notification';

export const useNotificationPrefs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATION_PREFS,
    queryFn: async () => {
      const token = await getAccessToken();
      return notificationService.getPrefs(token);
    },
    enabled: !!user,
    staleTime: 5 * 60_000,
  });
};

export const useUpdateNotificationPref = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      category,
      pushEnabled,
      inboxEnabled,
    }: {
      category: NotificationCategory;
      pushEnabled?: boolean;
      inboxEnabled?: boolean;
    }) => {
      const token = await getAccessToken();
      return notificationService.updatePref(token, category, {
        pushEnabled,
        inboxEnabled,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION_PREFS });
    },
  });
};
