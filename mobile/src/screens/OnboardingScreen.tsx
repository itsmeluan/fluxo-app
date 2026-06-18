import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

/**
 * STUB — só a estrutura de navegação está pronta. Conteúdo real de onboarding
 * (explicar JTBD, perguntar regime tributário MEI/Simples/carnê-leão para
 * configurar os baldes, etc. — ver golden source seção 3.5) é a próxima fatia,
 * não bloqueia o teste do motor de captura.
 */
export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>FLUXO</Text>
      <Text style={styles.subtitulo}>Seu salário, mesmo sem patrão.</Text>

      <Text style={styles.stubAviso}>
        (Onboarding ainda é só um stub — fluxo completo de configuração de regime
        e baldes vem na próxima fatia.)
      </Text>

      <Pressable style={styles.botao} onPress={() => navigation.navigate("Dashboard")}>
        <Text style={styles.botaoTexto}>Continuar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "700",
  },
  subtitulo: {
    color: "#94A3B8",
    fontSize: 16,
    marginBottom: 24,
  },
  stubAviso: {
    color: "#64748B",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 24,
  },
  botao: {
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  botaoTexto: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "600",
  },
});
