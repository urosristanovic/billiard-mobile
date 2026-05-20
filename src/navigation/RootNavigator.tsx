import { useEffect } from "react";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/useAuthStore";
import { getTokens, clearTokens } from "@/lib/tokenStorage";
import { authService } from "@/services/auth";
import { navigationIntegration } from "../../App";
import { AuthNavigator } from "./AuthNavigator";
import { AppNavigator } from "./AppNavigator";
import { LoadingState } from "@/components/common/states";

const navigationRef = createNavigationContainerRef();

export const RootNavigator = () => {
  const { t } = useTranslation("common");
  const { user, isInitialized, setUser, setInitialized, setLoading } = useAuthStore();

  useEffect(() => {
    async function initAuth() {
      const tokens = await getTokens();

      if (!tokens) {
        setInitialized(true);
        return;
      }

      try {
        setLoading(true);
        // getAccessToken inside authService.me() will auto-refresh if needed
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
    return <LoadingState message={t("loading")} />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        navigationIntegration.registerNavigationContainer(navigationRef);
      }}
    >
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
