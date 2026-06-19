import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { getAlertaImposto } from "../api/client";
import type { AlertaImposto } from "../types/entry";

/**
 * Alerta de imposto (mockup §3.13 / US-008). Compara o saldo do balde de
 * imposto com a estimativa do taxEngine. Os valores são ESTIMATIVAS
 * não-autoritativas — a tela deixa isso explícito, sem prometer precisão fiscal.
 */
export default function AlertaImpostoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [alerta, setAlerta] = useState<AlertaImposto | null>(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      getAlertaImposto()
        .then((a) => ativo && (setAlerta(a), setErro(null)))
        .catch((err) => ativo && setErro(err instanceof Error ? err.message : "Erro ao carregar."))
        .finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, [])
  );

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color="#22C55E" />
      </View>
    );
  }

  if (erro || !alerta) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro ?? "Sem dados."}</Text>
      </View>
    );
  }

  const semRegime = alerta.regime === null;
  const coberto = alerta.coberto === true;

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      {semRegime ? (
        <View style={[styles.banner, styles.bannerWarn]}>
          <Text style={styles.bannerEmoji}>ℹ️</Text>
          <Text style={styles.bannerTexto}>{alerta.detalhe}</Text>
        </View>
      ) : (
        <View style={[styles.banner, coberto ? styles.bannerOk : styles.bannerDanger]}>
          <Text style={styles.bannerEmoji}>{coberto ? "✓" : "⚠️"}</Text>
          <Text style={styles.bannerTexto}>
            {coberto
              ? `Seu balde de imposto (${formatBRL(alerta.saldoBaldeImposto)}) cobre a estimativa de ${formatBRL(
                  alerta.valorReservar ?? 0
                )} para este mês.`
              : `Atenção: a estimativa de imposto deste mês é ${formatBRL(
                  alerta.valorReservar ?? 0
                )} e seu balde tem ${formatBRL(alerta.saldoBaldeImposto)}. Registre suas entradas para reforçar a reserva.`}
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Linha label="Saldo do balde imposto" valor={formatBRL(alerta.saldoBaldeImposto)} />
        {alerta.valorReservar !== null && (
          <Linha label="Estimativa a reservar (mês)" valor={formatBRL(alerta.valorReservar)} />
        )}
        {alerta.aliquotaEfetiva !== null && (
          <Linha label="Alíquota efetiva estimada" valor={`${(alerta.aliquotaEfetiva * 100).toFixed(1)}%`} ultima />
        )}
      </View>

      <Text style={styles.disclaimer}>{alerta.detalhe}</Text>
      <Text style={styles.disclaimer}>
        Estes valores são estimativas para te ajudar a se organizar — não substituem a orientação do seu contador.
      </Text>

      {semRegime ? (
        <Pressable style={styles.botao} onPress={() => navigation.navigate("BaldesConfig")}>
          <Text style={styles.botaoTexto}>Definir meu regime</Text>
        </Pressable>
      ) : (
        !coberto && (
          <Pressable style={styles.botao} onPress={() => navigation.navigate("NovaEntrada")}>
            <Text style={styles.botaoTexto}>Registrar entrada</Text>
          </Pressable>
        )
      )}
    </ScrollView>
  );
}

function Linha({ label, valor, ultima }: { label: string; valor: string; ultima?: boolean }) {
  return (
    <View style={[styles.linha, ultima && styles.linhaUltima]}>
      <Text style={styles.linhaLabel}>{label}</Text>
      <Text style={styles.linhaValor}>{valor}</Text>
    </View>
  );
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const styles = StyleSheet.create({
  tela: { backgroundColor: "#0F172A" },
  container: { padding: 20, gap: 14 },
  centro: { flex: 1, backgroundColor: "#0F172A", alignItems: "center", justifyContent: "center", padding: 24 },
  erro: { color: "#F87171", textAlign: "center" },
  banner: { flexDirection: "row", gap: 10, alignItems: "flex-start", borderRadius: 14, padding: 14 },
  bannerOk: { backgroundColor: "rgba(34,197,94,0.12)" },
  bannerDanger: { backgroundColor: "rgba(248,113,113,0.12)" },
  bannerWarn: { backgroundColor: "rgba(251,191,36,0.12)" },
  bannerEmoji: { fontSize: 16 },
  bannerTexto: { color: "#E2E8F0", fontSize: 13, flex: 1, lineHeight: 19 },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  linhaUltima: { borderBottomWidth: 0 },
  linhaLabel: { color: "#94A3B8", fontSize: 14, flex: 1, marginRight: 12 },
  linhaValor: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  disclaimer: { color: "#64748B", fontSize: 12, lineHeight: 17 },
  botao: { backgroundColor: "#22C55E", paddingVertical: 14, borderRadius: 14, alignItems: "center", marginTop: 4 },
  botaoTexto: { color: "#0F172A", fontSize: 15, fontWeight: "700" },
});
