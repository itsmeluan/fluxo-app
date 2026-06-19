import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import LoginScreen from "../screens/LoginScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CaptureScreen from "../screens/CaptureScreen";
import NovaEntradaScreen from "../screens/NovaEntradaScreen";
import EntradaConfirmacaoScreen from "../screens/EntradaConfirmacaoScreen";
import DespesasFixasScreen from "../screens/DespesasFixasScreen";
import BaldesConfigScreen from "../screens/BaldesConfigScreen";
import SalarioDetalheScreen from "../screens/SalarioDetalheScreen";
import HistoricoScreen from "../screens/HistoricoScreen";
import HistoricoMesDetalheScreen from "../screens/HistoricoMesDetalheScreen";
import ContrachequeScreen from "../screens/ContrachequeScreen";
import AlertaImpostoScreen from "../screens/AlertaImpostoScreen";
import { onboardingFoiConcluido } from "../lib/session";

export type RootStackParamList = {
  Login: undefined;
  Onboarding: undefined;
  Dashboard: undefined;
  Capture: undefined;
  NovaEntrada: undefined;
  EntradaConfirmacao: { entryId: string; valor: number; tipo: "receita" | "despesa" };
  DespesasFixas: undefined;
  BaldesConfig: undefined;
  SalarioDetalhe: undefined;
  Historico: undefined;
  HistoricoMesDetalhe: { ano: number; mes: number; valor: number; pct: number | null };
  Contracheque: undefined;
  AlertaImposto: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navegação. Primeiro decide pela sessão do Supabase Auth: sem sessão → Login;
 * com sessão → app, com rota inicial dependendo de o onboarding já ter sido
 * concluído (flag local em AsyncStorage). O onAuthStateChange troca a árvore
 * automaticamente em login/logout.
 */
export default function RootNavigation() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [onboarded, setOnboarded] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    onboardingFoiConcluido().then(setOnboarded);
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined || onboarded === undefined) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color="#22C55E" />
      </View>
    );
  }

  if (!session) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={onboarded ? "Dashboard" : "Onboarding"}>
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
        <Stack.Screen
          name="DespesasFixas"
          component={DespesasFixasScreen}
          options={{ title: "Despesas fixas" }}
        />
        <Stack.Screen
          name="BaldesConfig"
          component={BaldesConfigScreen}
          options={{ title: "Configuração de baldes" }}
        />
        <Stack.Screen
          name="SalarioDetalhe"
          component={SalarioDetalheScreen}
          options={{ title: "Seu salário" }}
        />
        <Stack.Screen name="Historico" component={HistoricoScreen} options={{ title: "Histórico" }} />
        <Stack.Screen
          name="HistoricoMesDetalhe"
          component={HistoricoMesDetalheScreen}
          options={{ title: "Detalhe do mês" }}
        />
        <Stack.Screen name="Contracheque" component={ContrachequeScreen} options={{ title: "Contracheque" }} />
        <Stack.Screen name="AlertaImposto" component={AlertaImpostoScreen} options={{ title: "Alerta de imposto" }} />
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
