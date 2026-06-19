import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { getMe, listEntries } from "../api/client";
import { ultimosMeses, type MesAgregado } from "../lib/agregacao";

/**
 * Histórico dos últimos 12 meses (mockup §3.10 / US-006). Barras = receita do
 * mês; linha tracejada = meta de salário. Agregação client-side (ver agregacao.ts).
 */
export default function HistoricoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [meses, setMeses] = useState<MesAgregado[]>([]);
  const [meta, setMeta] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      Promise.all([listEntries(), getMe()])
        .then(([dados, me]) => {
          if (!ativo) return;
          setMeses(ultimosMeses(dados.entries, 12));
          setMeta(me.metaSalario);
          setErro(null);
        })
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

  const maxValor = Math.max(...meses.map((m) => m.receitas), meta ?? 0, 1);
  const tendencia = calcularTendencia(meses);

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      {erro && <Text style={styles.erro}>{erro}</Text>}

      {tendencia !== null && (
        <Text style={styles.tendencia}>
          {tendencia >= 0 ? "↑" : "↓"} {Math.abs(tendencia)}% vs. trimestre anterior
        </Text>
      )}

      <View style={styles.card}>
        <View style={styles.chart}>
          {meta != null && meta > 0 && (
            <View style={[styles.linhaMeta, { bottom: `${Math.min(100, (meta / maxValor) * 100)}%` }]}>
              <Text style={styles.linhaMetaTexto}>Meta {formatBRLCompact(meta)}</Text>
            </View>
          )}
          {meses.map((m) => {
            const altura = (m.receitas / maxValor) * 100;
            const bom = meta != null && meta > 0 && m.receitas >= meta * 0.9;
            return (
              <Pressable
                key={`${m.ano}-${m.mes}`}
                style={styles.barCol}
                onPress={() =>
                  navigation.navigate("HistoricoMesDetalhe", {
                    ano: m.ano,
                    mes: m.mes,
                    valor: m.receitas,
                    pct: meta && meta > 0 ? Math.round((m.receitas / meta) * 100) : null,
                  })
                }
              >
                <View style={[styles.bar, { height: `${altura}%`, backgroundColor: bom ? "#22C55E" : "#64748B" }]} />
                <Text style={styles.barLabel}>{m.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={styles.legenda}>
        Linha tracejada = sua meta. Toque em um mês para ver os detalhes. Barras verdes atingiram ao menos 90% da meta.
      </Text>
    </ScrollView>
  );
}

/** Tendência simples: média dos últimos 3 meses vs. 3 anteriores. */
function calcularTendencia(meses: MesAgregado[]): number | null {
  if (meses.length < 6) return null;
  const ult3 = meses.slice(-3).reduce((s, m) => s + m.receitas, 0) / 3;
  const ant3 = meses.slice(-6, -3).reduce((s, m) => s + m.receitas, 0) / 3;
  if (ant3 === 0) return null;
  return Math.round(((ult3 - ant3) / ant3) * 100);
}

function formatBRLCompact(valor: number): string {
  return `R$${Math.round(valor).toLocaleString("pt-BR")}`;
}

const styles = StyleSheet.create({
  tela: { backgroundColor: "#0F172A" },
  container: { padding: 20, gap: 14 },
  centro: { flex: 1, backgroundColor: "#0F172A", alignItems: "center", justifyContent: "center" },
  erro: { color: "#F87171", textAlign: "center" },
  tendencia: { color: "#94A3B8", fontSize: 13 },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  chart: { flexDirection: "row", alignItems: "flex-end", gap: 4, height: 150, position: "relative" },
  linhaMeta: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#94A3B8",
    borderStyle: "dashed",
  },
  linhaMetaTexto: { color: "#94A3B8", fontSize: 9 },
  barCol: { flex: 1, alignItems: "center", justifyContent: "flex-end", height: "100%", gap: 4 },
  bar: { width: "100%", borderRadius: 4, minHeight: 2 },
  barLabel: { color: "#94A3B8", fontSize: 9 },
  legenda: { color: "#64748B", fontSize: 12, lineHeight: 17, textAlign: "center" },
});
