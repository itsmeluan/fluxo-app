import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { MESES_LONGOS } from "../lib/agregacao";

/**
 * Detalhe de um mês do histórico (mockup §3.11). Recebe os valores já
 * calculados pela tela anterior — sem chamada de API própria.
 */
export default function HistoricoMesDetalheScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { ano, mes, valor, pct } = useRoute<RouteProp<RootStackParamList, "HistoricoMesDetalhe">>().params;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {MESES_LONGOS[mes]} de {ano}
      </Text>
      <Text style={styles.valor}>{formatBRL(valor)}</Text>
      <Text style={styles.muted}>
        {pct !== null ? `${pct}% da meta daquele mês` : "recebido no mês"}
      </Text>
      <View style={styles.flex} />
      <Pressable style={styles.botao} onPress={() => navigation.goBack()}>
        <Text style={styles.botaoTexto}>Voltar ao histórico</Text>
      </Pressable>
    </View>
  );
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 24, alignItems: "center", justifyContent: "center", gap: 8 },
  titulo: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  valor: { color: "#22C55E", fontSize: 40, fontWeight: "800" },
  muted: { color: "#94A3B8", fontSize: 14 },
  flex: { flex: 0, height: 24 },
  botao: {
    backgroundColor: "#16213a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  botaoTexto: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
});
