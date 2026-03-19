import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/screens/auth/LoginScreen";
import SignupScreen from "@/screens/auth/SignupScreen";
import ForgotPasswordScreen from "@/screens/auth/ForgotPasswordScreen";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login">
      {(props) => (
        <LoginScreen
          {...props}
          onNavigateSignup={() => props.navigation.navigate("Signup")}
          onNavigateForgotPassword={() => props.navigation.navigate("ForgotPassword")}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="Signup">
      {(props) => (
        <SignupScreen {...props} onNavigateLogin={() => props.navigation.navigate("Login")} />
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
