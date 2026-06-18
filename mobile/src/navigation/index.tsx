import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CaptureScreen from "../screens/CaptureScreen";

export type RootStackParamList = {
  Onboarding: undefined;
  Dashboard: undefined;
  Capture: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navegação básica do protótipo. Onboarding -> Dashboard -> Captura (modal-like).
 * Sem autenticação ainda — todo usuário "começa" no Onboarding a cada abertura
 * do app, até existir login/persistência de sessão.
 */
export default function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: "FLUXO" }}
        />
        <Stack.Screen
          name="Capture"
          component={CaptureScreen}
          options={{ title: "Capturar lançamento", presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
