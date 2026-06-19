import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getBucketConfig, listEntries } from "../api/client";
import { MESES_LONGOS, mesFechadoAnterior, resumoDoMes } from "../lib/agregacao";

/**
 * Contracheque do mês fechado (mockup §3.12 / US-007). Alvo do deep link da
 * notificação do dia 1. Agregação client-side a partir dos lançamentos.
 */
export default function ContrachequeScreen() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [dados, setDados] = useState<{
    ano: number;
    mes: number;
    salarioRecebido: number;
    impostoReservado: number;
    variacao: number | null;
    maiorCliente: { descricao: string; total: number } | null;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      Promise.all([listEntries(), getBucketConfig()])
        .then(([resp, config]) => {
          if (!ativo) return;
          const { ano, mes } = mesFechadoAnterior();
          const atual = resumoDoMes(resp.entries, ano, mes);
          const anteriorData = new Date(ano, mes - 1, 1);
          const anterior = resumoDoMes(resp.entries, anteriorData.getFullYear(), anteriorData.getMonth());
          const variacao =
            anterior.salarioRecebido > 0
              ? Math.round(((atual.salarioRecebido - anterior.salarioRecebido) / anterior.salarioRecebido) * 100)
              : null;
          setDados({
            ano,
            mes,
            salarioRecebido: atual.salarioRecebido,
            impostoReservado: atual.salarioRecebido * config.percentImposto,
            variacao,
            maiorCliente: atual.maiorCliente,
          });
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

  if (erro || !dados) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>{erro ?? "Sem dados."}</Text>
      </View>
    );
  }

  const semDados = dados.salarioRecebido === 0;

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      <Text style={styles.cabecalho}>
        Seu salário de {MESES_LONGOS[dados.mes]} foi {formatBRL(dados.salarioRecebido)} ✓
      </Text>

      {semDados ? (
        <Text style={styles.vazio}>
          Não há lançamentos em {MESES_LONGOS[dados.mes]} de {dados.ano}. Quando você registrar receitas, o
          contracheque do mês fechado aparece aqui.
        </Text>
      ) : (
        <View style={styles.card}>
          <Linha label="Salário recebido" valor={formatBRL(dados.salarioRecebido)} />
          <Linha label="Imposto reservado" valor={formatBRL(dados.impostoReservado)} />
          <Linha
            label="Variação vs. mês anterior"
            valor={dados.variacao !== null ? `${dados.variacao >= 0 ? "+" : ""}${dados.variacao}%` : "—"}
            cor={dados.variacao !== null ? (dados.variacao >= 0 ? "#22C55E" : "#F87171") : "#E2E8F0"}
          />
          <Linha
            label="Maior cliente do mês"
            valor={
              dados.maiorCliente
                ? `${dados.maiorCliente.descricao} — ${formatBRL(dados.maiorCliente.total)}`
                : "—"
            }
            ultima
          />
        </View>
      )}
    </ScrollView>
  );
}

function Linha({ label, valor, cor, ultima }: { label: string; valor: string; cor?: string; ultima?: boolean }) {
  return (
    <View style={[styles.linha, ultima && styles.linhaUltima]}>
      <Text style={styles.linhaLabel}>{label}</Text>
      <Text style={[styles.linhaValor, cor ? { color: cor } : null]}>{valor}</Text>
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
  cabecalho: { color: "#94A3B8", fontSize: 14, textAlign: "center" },
  vazio: { color: "#64748B", fontSize: 14, textAlign: "center", lineHeight: 20 },
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
  linhaValor: { color: "#FFFFFF", fontSize: 14, fontWeight: "700", textAlign: "right", flexShrink: 1 },
});
