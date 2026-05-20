import 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  Barlow_400Regular,
  Barlow_500Medium,
  Barlow_600SemiBold,
  Barlow_700Bold,
} from '@expo-google-fonts/barlow';
import { Oswald_600SemiBold, Oswald_700Bold } from '@expo-google-fonts/oswald';
import { queryClient } from '@/lib/queryClient';
import { clearHasSeenOnboarding } from '@/lib/onboardingStorage';
import { RootNavigator } from '@/navigation/RootNavigator';
import { ConfirmDialogProvider } from '@/components/common/dialog';
import { ToastProvider } from '@/components/common/toast';
import '@/i18n';
import { hydrateLanguage } from '@/i18n';

export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !__DEV__ && !!process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 0.2,
  integrations: [navigationIntegration],
  beforeSend(event) {
    const build = event.contexts?.os?.build;
    const isEmulator =
      typeof build === 'string' &&
      (build.includes('sdk_') || build.includes('test-keys'));
    event.tags = { ...event.tags, is_emulator: String(isEmulator) };
    return event;
  },
});

function App() {
  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Oswald_600SemiBold,
    Barlow_400Regular,
    Barlow_500Medium,
    Barlow_600SemiBold,
    Barlow_700Bold,
  });
  const [isLanguageReady, setIsLanguageReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (__DEV__) {
        await clearHasSeenOnboarding();
      }
      await hydrateLanguage().catch(() => undefined);
      setIsLanguageReady(true);
    };
    void init();
  }, []);

  if (!fontsLoaded || !isLanguageReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <StatusBar style='light' />
            <ToastProvider>
              <ConfirmDialogProvider>
                <RootNavigator />
              </ConfirmDialogProvider>
            </ToastProvider>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
