import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/useAuthStore';
import { getTokens, clearTokens } from '@/lib/tokenStorage';
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
    async function initAuth() {
      const tokens = await getTokens();

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

    initAuth();
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
