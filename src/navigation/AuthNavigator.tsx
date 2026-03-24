import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/screens/auth/LoginScreen";
import SignupScreen from "@/screens/auth/SignupScreen";
import ForgotPasswordScreen from "@/screens/auth/ForgotPasswordScreen";
import OnboardingScreen from "@/screens/auth/OnboardingScreen";
import { LoadingState } from "@/components/common/states";
import { getHasSeenOnboarding } from "@/lib/onboardingStorage";

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<
    keyof AuthStackParamList | null
  >(null);

  useEffect(() => {
    getHasSeenOnboarding().then(seen => {
      setInitialRoute(seen ? "Login" : "Onboarding");
    });
  }, []);

  if (initialRoute === null) {
    return <LoadingState />;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Onboarding">
        {(props) => (
          <OnboardingScreen
            onNavigateLogin={() => props.navigation.replace("Login")}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            onNavigateSignup={() => props.navigation.navigate("Signup")}
            onNavigateForgotPassword={() =>
              props.navigation.navigate("ForgotPassword")
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Signup">
        {(props) => (
          <SignupScreen
            {...props}
            onNavigateLogin={() => props.navigation.navigate("Login")}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword">
        {(props) => (
          <ForgotPasswordScreen
            {...props}
            onNavigateLogin={() => props.navigation.navigate("Login")}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
