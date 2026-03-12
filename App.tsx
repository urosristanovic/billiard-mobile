import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
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
import { RootNavigator } from '@/navigation/RootNavigator';
import { ConfirmDialogProvider } from '@/components/common/dialog';
import { ToastProvider } from '@/components/common/toast';
import '@/i18n';
import { hydrateLanguage } from '@/i18n';

export default function App() {
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
    hydrateLanguage()
      .catch(() => undefined)
      .finally(() => setIsLanguageReady(true));
  }, []);

  if (!fontsLoaded || !isLanguageReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style='light' />
        <ToastProvider>
          <ConfirmDialogProvider>
            <RootNavigator />
          </ConfirmDialogProvider>
        </ToastProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
