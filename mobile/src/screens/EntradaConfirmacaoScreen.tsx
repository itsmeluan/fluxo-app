import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { getBucketConfig } from "../api/client";
import type { BucketConfig } from "../types/entry";

/**
 * Confirmação de lançamento — tela compartilhada entre captura e entrada manual
 * (mockup §3.4 / US-004). O lançamento já foi persistido antes de chegar aqui;
 * esta tela só mostra como a entrada se divide entre os baldes (no caso de
 * receita) usando os percentuais atuais do usuário — o mesmo critério do motor
 * de baldes no backend.
 */

const BALDES: { chave: keyof BucketConfig; label: string }[] = [
  { chave: "percentSalario", label: "Salário" },
  { chave: "percentImposto", label: "Imposto" },
  { chave: "percentReserva", label: "Reserva" },
  { chave: "percentReinvestimento", label: "Reinvestimento" },
];

export default function EntradaConfirmacaoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { valor, tipo } = useRoute<RouteProp<RootStackParamList, "EntradaConfirmacao">>().params;

  const [config, setConfig] = useState<BucketConfig | null>(null);
  const [carregando, setCarregando] = useState(tipo === "receita");

  useEffect(() => {
    if (tipo !== "receita") return;
    getBucketConfig()
      .then(setConfig)
      .catch(() => setConfig(null))
      .finally(() => setCarregando(false));
  }, [tipo]);

  function concluir() {
    navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>✅</Text>
      <Text style={styles.titulo}>
        {tipo === "despesa"
          ? `${formatBRL(valor)} registrados como despesa`
          : `${formatBRL(valor)} divididos`}
      </Text>

      {tipo === "receita" && (
        <View style={styles.card}>
          {carregando ? (
            <ActivityIndicator color="#22C55E" />
          ) : config ? (
            BALDES.map(({ chave, label }) => (
              <View key={chave} style={styles.linha}>
                <Text style={styles.linhaLabel}>✓ {label}</Text>
                <Text style={styles.linhaValor}>{formatBRL(valor * config[chave])}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.aviso}>
              Não foi possível carregar a divisão agora — o lançamento foi salvo mesmo assim.
            </Text>
          )}
        </View>
      )}

      {tipo === "despesa" && (
        <Text style={styles.subtexto}>
          Despesas sem balde definido saem do seu balde de Salário.
        </Text>
      )}

      <View style={styles.flex} />

      <Pressable style={styles.botao} onPress={concluir}>
        <Text style={styles.botaoTexto}>Concluir</Text>
      </Pressable>
    </View>
  );
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 24, alignItems: "center", gap: 14 },
  emoji: { fontSize: 42, marginTop: 12 },
  titulo: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", textAlign: "center" },
  card: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    gap: 4,
    minHeight: 60,
    justifyContent: "center",
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  linhaLabel: { color: "#E2E8F0", fontSize: 14 },
  linhaValor: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  aviso: { color: "#FBBF24", fontSize: 13, textAlign: "center" },
  subtexto: { color: "#94A3B8", fontSize: 13, textAlign: "center" },
  flex: { flex: 1 },
  botao: {
    backgroundColor: "#22C55E",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    width: "100%",
  },
  botaoTexto: { color: "#0F172A", fontSize: 15, fontWeight: "700" },
});
