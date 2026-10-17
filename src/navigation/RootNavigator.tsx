import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/useAuthStore';
import { AppState } from 'react-native';
import {
  getTokens,
  clearTokens,
  isKeychainLockedError,
  migrateTokenAccessibility,
} from '@/lib/tokenStorage';
import { authService } from '@/services/auth';
import { navigationIntegration } from '@/lib/sentryIntegration';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { LoadingState } from '@/components/common/states';
import { navigationRef, type RootStackParamList } from './navigationService';
import NotificationsScreen from '@/screens/notifications/NotificationsScreen';
import NotificationSettingsScreen from '@/screens/notifications/NotificationSettingsScreen';

export type { RootStackParamList };

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { t } = useTranslation('common');
  const { user, isInitialized, setUser, setInitialized, setLoading } =
    useAuthStore();

  useEffect(() => {
    let cancelled = false;
    let started = false;
    let appStateSub: { remove: () => void } | null = null;

    async function initAuth() {
      if (started) return;
      started = true;

      let tokens;
      try {
        tokens = await getTokens();
      } catch (err) {
        if (cancelled) return;
        if (isKeychainLockedError(err)) {
          // App was launched in the background while the device is locked;
          // the keychain is unavailable. Retry once the app becomes active.
          started = false;
          if (!appStateSub) {
            appStateSub = AppState.addEventListener('change', (state) => {
              if (state === 'active') {
                appStateSub?.remove();
                appStateSub = null;
                void initAuth();
              }
            });
          }
          return;
        }
        setInitialized(true);
        return;
      }

      void migrateTokenAccessibility();

      if (!tokens) {
        setInitialized(true);
        return;
      }

      try {
        setLoading(true);
        const me = await authService.me();
        setUser(me);
      } catch (err) {
        if (err instanceof Error && err.message === 'account_deleted') {
          await clearTokens();
        }
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }

    if (AppState.currentState === 'active') {
      void initAuth();
    } else {
      // Background launch: wait until the app is foregrounded (device unlocked).
      appStateSub = AppState.addEventListener('change', (state) => {
        if (state === 'active') {
          appStateSub?.remove();
          appStateSub = null;
          void initAuth();
        }
      });
    }

    return () => {
      cancelled = true;
      appStateSub?.remove();
    };
  }, [setInitialized, setLoading, setUser]);

  if (!isInitialized) {
    return <LoadingState message={t('loading')} />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        navigationIntegration.registerNavigationContainer(navigationRef);
      }}
    >
      {user ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name='Main' component={AppNavigator} />
          <RootStack.Screen
            name='Notifications'
            component={NotificationsScreen}
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <RootStack.Screen
            name='NotificationSettings'
            component={NotificationSettingsScreen}
          />
        </RootStack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};
