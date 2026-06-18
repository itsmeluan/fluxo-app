import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

/**
 * STUB — dashboard real (quanto posso me pagar este mês, runway, progresso dos
 * baldes — golden source seções 3.4/3.5) ainda não existe. Esta tela hoje só
 * serve de ponto de entrada para testar o motor de captura via o botão abaixo.
 */
export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.stubAviso}>
        Dashboard ainda é um stub. Os números de salário/runway/baldes vêm na
        próxima fatia — hoje este protótipo testa só o motor de captura.
      </Text>

      <Pressable
        style={styles.botaoCaptura}
        onPress={() => navigation.navigate("Capture")}
      >
        <Text style={styles.botaoCapturaTexto}>📷 Capturar recibo / comprovante</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 24,
    justifyContent: "center",
    gap: 24,
  },
  stubAviso: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
  },
  botaoCaptura: {
    backgroundColor: "#22C55E",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  botaoCapturaTexto: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
});
