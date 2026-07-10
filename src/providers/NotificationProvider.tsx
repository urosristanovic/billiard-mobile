import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/useAuth';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { registerForPush } from '@/lib/notifications/registerForPush';
import { notificationService } from '@/services/notification';
import { navigationRef } from '@/navigation/navigationService';
import { QUERY_KEYS } from '@/config/queryKeys';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldPlaySound_deprecated: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificationData = {
  screen?: string;
  params?: Record<string, unknown>;
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const appStateRef = useRef(AppState.currentState);

  // Register device push token when user logs in
  useEffect(() => {
    if (!user) return;

    void (async () => {
      const expoToken = await registerForPush();
      if (!expoToken) return;

      const accessToken = await getAccessToken().catch(() => null);
      if (!accessToken) return;

      await notificationService
        .registerDevice(accessToken, {
          expoToken,
          platform: Platform.OS as 'ios' | 'android',
        })
        .catch(err => console.error('[notify] Device registration failed:', err));
    })();
  // Re-run only when user identity changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Deep-link on notification tap
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content
          .data as NotificationData;

        if (data?.screen && navigationRef.isReady()) {
          // @ts-ignore – screen names come from the push payload dynamically
          navigationRef.navigate(data.screen, data.params);
        }
      },
    );
    return () => sub.remove();
  }, []);

  // Refresh unread count when app returns to foreground (polling fallback)
  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT,
        });
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [queryClient]);

  return <>{children}</>;
};
