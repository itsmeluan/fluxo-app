import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { getBucketConfig, updateEntrySplit } from "../api/client";
import type { BucketConfig } from "../types/entry";

/**
 * Confirmação de lançamento — tela compartilhada entre captura e entrada manual
 * (mockup §3.4 / US-004). O lançamento já foi persistido; aqui mostramos como a
 * receita se divide entre os baldes e permitimos ajustar essa divisão SÓ para
 * este lançamento (PATCH /entries/:id/split → override no motor de baldes).
 */

const BALDES: { chave: keyof BucketConfig; label: string }[] = [
  { chave: "percentSalario", label: "Salário" },
  { chave: "percentImposto", label: "Imposto" },
  { chave: "percentReserva", label: "Reserva" },
  { chave: "percentReinvestimento", label: "Reinvestimento" },
];

export default function EntradaConfirmacaoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { entryId, valor, tipo } = useRoute<RouteProp<RootStackParamList, "EntradaConfirmacao">>().params;

  const [config, setConfig] = useState<BucketConfig | null>(null);
  const [carregando, setCarregando] = useState(tipo === "receita");
  const [editando, setEditando] = useState(false);
  const [editado, setEditado] = useState<BucketConfig | null>(null);
  const [salvando, setSalvando] = useState(false);

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

  function abrirEdicao() {
    if (config) setEditado({ ...config });
    setEditando(true);
  }

  function ajustar(chave: keyof BucketConfig, delta: number) {
    setEditado((e) =>
      e ? { ...e, [chave]: Math.min(1, Math.max(0, Math.round((e[chave] + delta) * 100) / 100)) } : e
    );
  }

  async function salvarDivisao() {
    if (!editado) return;
    setSalvando(true);
    try {
      await updateEntrySplit(entryId, {
        salario: editado.percentSalario,
        imposto: editado.percentImposto,
        reserva: editado.percentReserva,
        reinvestimento: editado.percentReinvestimento,
      });
      setConfig(editado); // reflete a nova divisão no resumo desta tela
      setEditando(false);
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível salvar a divisão.");
    } finally {
      setSalvando(false);
    }
  }

  const totalEditado = editado
    ? Math.round((editado.percentSalario + editado.percentImposto + editado.percentReserva + editado.percentReinvestimento) * 100)
    : 100;

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>✅</Text>
      <Text style={styles.titulo}>
        {tipo === "despesa" ? `${formatBRL(valor)} registrados como despesa` : `${formatBRL(valor)} divididos`}
      </Text>

      {tipo === "receita" && (
        <View style={styles.card}>
          {carregando ? (
            <ActivityIndicator color="#22C55E" />
          ) : !config ? (
            <Text style={styles.aviso}>
              Não foi possível carregar a divisão agora — o lançamento foi salvo mesmo assim.
            </Text>
          ) : editando && editado ? (
            <>
              {BALDES.map(({ chave, label }) => (
                <View key={chave} style={styles.linhaEdit}>
                  <Text style={styles.linhaLabel}>{label}</Text>
                  <View style={styles.stepper}>
                    <Pressable style={styles.stepBtn} onPress={() => ajustar(chave, -0.05)}>
                      <Text style={styles.stepBtnTxt}>−</Text>
                    </Pressable>
                    <Text style={styles.stepVal}>{Math.round(editado[chave] * 100)}%</Text>
                    <Pressable style={styles.stepBtn} onPress={() => ajustar(chave, 0.05)}>
                      <Text style={styles.stepBtnTxt}>+</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
              <Text style={[styles.total, { color: totalEditado === 100 ? "#22C55E" : "#FBBF24" }]}>
                Total: {totalEditado}% {totalEditado === 100 ? "✓" : "⚠️"}
              </Text>
            </>
          ) : (
            BALDES.map(({ chave, label }) => (
              <View key={chave} style={styles.linha}>
                <Text style={styles.linhaLabel}>✓ {label}</Text>
                <Text style={styles.linhaValor}>{formatBRL(valor * config[chave])}</Text>
              </View>
            ))
          )}
        </View>
      )}

      {tipo === "receita" && config && !editando && (
        <Pressable onPress={abrirEdicao}>
          <Text style={styles.editarLink}>✏️ Editar divisão desta entrada</Text>
        </Pressable>
      )}

      {tipo === "despesa" && (
        <Text style={styles.subtexto}>Despesas sem balde definido saem do seu balde de Salário.</Text>
      )}

      <View style={styles.flex} />

      {editando ? (
        <View style={styles.botoesRow}>
          <Pressable style={[styles.botaoSec, salvando && styles.desab]} onPress={() => setEditando(false)} disabled={salvando}>
            <Text style={styles.botaoSecTxt}>Cancelar</Text>
          </Pressable>
          <Pressable style={[styles.botao, styles.flex1, salvando && styles.desab]} onPress={salvarDivisao} disabled={salvando}>
            {salvando ? <ActivityIndicator color="#0F172A" /> : <Text style={styles.botaoTexto}>Salvar divisão</Text>}
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.botao} onPress={concluir}>
          <Text style={styles.botaoTexto}>Concluir</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#0F172A" },
  container: { padding: 24, alignItems: "center", gap: 14, flexGrow: 1 },
  emoji: { fontSize: 42, marginTop: 12 },
  titulo: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", textAlign: "center" },
  card: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    gap: 6,
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
  linhaEdit: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  linhaLabel: { color: "#E2E8F0", fontSize: 14 },
  linhaValor: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  stepper: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#0F172A", alignItems: "center", justifyContent: "center" },
  stepBtnTxt: { color: "#22C55E", fontSize: 20, fontWeight: "700" },
  stepVal: { color: "#FFFFFF", fontSize: 14, fontWeight: "700", minWidth: 40, textAlign: "center" },
  total: { fontSize: 13, textAlign: "center", marginTop: 4 },
  editarLink: { color: "#22C55E", fontSize: 13, textDecorationLine: "underline" },
  aviso: { color: "#FBBF24", fontSize: 13, textAlign: "center" },
  subtexto: { color: "#94A3B8", fontSize: 13, textAlign: "center" },
  flex: { flex: 1 },
  flex1: { flex: 1 },
  botoesRow: { flexDirection: "row", gap: 10, width: "100%" },
  botao: { backgroundColor: "#22C55E", paddingVertical: 15, borderRadius: 14, alignItems: "center", width: "100%" },
  botaoTexto: { color: "#0F172A", fontSize: 15, fontWeight: "700" },
  botaoSec: { backgroundColor: "#16213a", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", paddingVertical: 15, paddingHorizontal: 20, borderRadius: 14, alignItems: "center" },
  botaoSecTxt: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  desab: { opacity: 0.5 },
});
