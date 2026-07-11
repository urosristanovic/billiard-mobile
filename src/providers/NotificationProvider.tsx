import type * as NotificationsAPI from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import Constants from 'expo-constants';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/useAuth';
import { getAccessToken } from '@/features/auth/getAccessToken';
import { registerForPush } from '@/lib/notifications/registerForPush';
import { notificationService } from '@/services/notification';
import { navigationRef } from '@/navigation/navigationService';
import { QUERY_KEYS } from '@/config/queryKeys';

// On Android Expo Go SDK 53+, expo-notifications' .fx side-effect file
// (DevicePushTokenAutoRegistration.fx.js) calls addPushTokenListener at
// MODULE EVALUATION TIME, which throws before any of our code runs.
// Conditional require() prevents the module from being evaluated at all on
// that platform — import type is erased at compile time so it's safe.
const isPushSupported =
  !(Platform.OS === 'android' && Constants.executionEnvironment === 'storeClient');

const Notifications: typeof NotificationsAPI | null = isPushSupported
  ? (require('expo-notifications') as typeof NotificationsAPI)
  : null;

Notifications?.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type NotificationData = {
  screen?: string;
  [key: string]: unknown;
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const appStateRef = useRef(AppState.currentState);
  const coldStartHandled = useRef(false);

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

  // Cold-start deep-link: app was launched by tapping a push notification
  useEffect(() => {
    if (!user || !Notifications || coldStartHandled.current) return;
    coldStartHandled.current = true;

    void (async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (!response) return;

      const { screen, ...params } = (response.notification.request.content
        .data ?? {}) as NotificationData;
      if (!screen) return;

      // Wait for navigator to be ready before navigating
      const waitForNav = () =>
        new Promise<void>(resolve => {
          const check = () => {
            if (navigationRef.isReady()) resolve();
            else setTimeout(check, 100);
          };
          check();
        });

      await waitForNav();
      // @ts-ignore – nested tab navigation requires complex generic typing
      navigationRef.navigate('Main', {
        screen: 'Home',
        params: { screen, params: Object.keys(params).length ? params : undefined },
      });
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Deep-link on notification tap (skipped on Android Expo Go)
  useEffect(() => {
    if (!Notifications) return;

    const sub = Notifications.addNotificationResponseReceivedListener(response => {
      const { screen, ...params } = (response.notification.request.content
        .data ?? {}) as NotificationData;

      if (screen && navigationRef.isReady()) {
        // Navigate through the Home tab — all current deep-link targets live in HomeStack.
        // @ts-ignore – nested tab navigation requires complex generic typing
        navigationRef.navigate('Main', {
          screen: 'Home',
          params: { screen, params: Object.keys(params).length ? params : undefined },
        });
      }
    });
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
