import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CaptureScreen from "../screens/CaptureScreen";
import NovaEntradaScreen from "../screens/NovaEntradaScreen";
import EntradaConfirmacaoScreen from "../screens/EntradaConfirmacaoScreen";
import { onboardingFoiConcluido } from "../lib/session";

export type RootStackParamList = {
  Onboarding: undefined;
  Dashboard: undefined;
  Capture: undefined;
  NovaEntrada: undefined;
  EntradaConfirmacao: { valor: number; tipo: "receita" | "despesa" };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navegação do protótipo. A rota inicial depende de o usuário já ter concluído
 * o onboarding (flag em AsyncStorage — stand-in de sessão até existir auth):
 * quem já passou cai direto no Dashboard; quem é novo começa no Onboarding.
 */
export default function RootNavigation() {
  const [rotaInicial, setRotaInicial] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    onboardingFoiConcluido().then((concluido) =>
      setRotaInicial(concluido ? "Dashboard" : "Onboarding")
    );
  }, []);

  if (rotaInicial === null) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color="#22C55E" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={rotaInicial}>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "FLUXO" }} />
        <Stack.Screen
          name="NovaEntrada"
          component={NovaEntradaScreen}
          options={{ title: "Nova entrada" }}
        />
        <Stack.Screen
          name="Capture"
          component={CaptureScreen}
          options={{ title: "Capturar lançamento", presentation: "modal" }}
        />
        <Stack.Screen
          name="EntradaConfirmacao"
          component={EntradaConfirmacaoScreen}
          options={{ title: "Lançamento confirmado", presentation: "modal", headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
});
