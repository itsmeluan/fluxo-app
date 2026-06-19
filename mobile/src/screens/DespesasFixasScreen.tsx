import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  listDespesasFixas,
  createDespesaFixa,
  deleteDespesaFixa,
} from "../api/client";
import type { DespesaFixa } from "../types/entry";

/**
 * Despesas fixas (mockup §3.9). Lista, adiciona e remove despesas recorrentes —
 * o total mensal alimenta o cálculo de fôlego no Dashboard.
 */
export default function DespesasFixasScreen() {
  const [despesas, setDespesas] = useState<DespesaFixa[]>([]);
  const [totalMensal, setTotalMensal] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [desc, setDesc] = useState("");
  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const dados = await listDespesasFixas();
      setDespesas(dados.despesas);
      setTotalMensal(dados.totalMensal);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar despesas.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      carregar().finally(() => {
        if (ativo) setCarregando(false);
      });
      return () => {
        ativo = false;
      };
    }, [carregar])
  );

  async function adicionar() {
    const valorNum = Number(valor.replace(/\./g, "").replace(",", "."));
    if (!desc.trim()) {
      Alert.alert("Descrição obrigatória", "Dê um nome para a despesa.");
      return;
    }
    if (!Number.isFinite(valorNum) || valorNum <= 0) {
      Alert.alert("Valor inválido", "Informe um valor maior que zero.");
      return;
    }
    setSalvando(true);
    try {
      await createDespesaFixa(desc.trim(), valorNum);
      setDesc("");
      setValor("");
      await carregar();
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível adicionar.");
    } finally {
      setSalvando(false);
    }
  }

  async function remover(id: string) {
    try {
      await deleteDespesaFixa(id);
      await carregar();
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível remover.");
    }
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      <Text style={styles.intro}>
        Usadas para calcular seu fôlego financeiro (por quanto tempo você se mantém sem nova receita).
      </Text>

      {carregando ? (
        <ActivityIndicator color="#22C55E" style={{ marginVertical: 24 }} />
      ) : erro ? (
        <Text style={styles.erro}>{erro}</Text>
      ) : (
        <>
          <View style={styles.card}>
            {despesas.length === 0 ? (
              <Text style={styles.vazio}>Nenhuma despesa fixa registrada ainda.</Text>
            ) : (
              despesas.map((d) => (
                <View key={d.id} style={styles.item}>
                  <Text style={styles.itemDesc} numberOfLines={1}>
                    {d.descricao}
                  </Text>
                  <View style={styles.itemDir}>
                    <Text style={styles.itemValor}>{formatBRL(d.valor)}</Text>
                    <Pressable onPress={() => remover(d.id)} hitSlop={8}>
                      <Text style={styles.remover}>✕</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.cardTotal}>
            <Text style={styles.totalLabel}>Total mensal</Text>
            <Text style={styles.totalValor}>{formatBRL(totalMensal)}</Text>
          </View>
        </>
      )}

      <View style={styles.card}>
        <Text style={styles.formTitulo}>Adicionar despesa</Text>
        <View style={styles.campo}>
          <Text style={styles.campoLabel}>Descrição</Text>
          <TextInput
            style={styles.input}
            value={desc}
            onChangeText={setDesc}
            placeholder="Ex: Aluguel do escritório"
            placeholderTextColor="#64748B"
          />
        </View>
        <View style={styles.campo}>
          <Text style={styles.campoLabel}>Valor (R$)</Text>
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            keyboardType="decimal-pad"
            placeholder="0,00"
            placeholderTextColor="#64748B"
          />
        </View>
        <Pressable
          style={[styles.botao, salvando && styles.desabilitado]}
          onPress={adicionar}
          disabled={salvando}
        >
          {salvando ? <ActivityIndicator color="#0F172A" /> : <Text style={styles.botaoTexto}>+ Adicionar despesa</Text>}
        </Pressable>
      </View>
    </ScrollView>
  );
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const styles = StyleSheet.create({
  tela: { backgroundColor: "#0F172A" },
  container: { padding: 20, gap: 14, paddingBottom: 40 },
  intro: { color: "#94A3B8", fontSize: 13, lineHeight: 19 },
  erro: { color: "#F87171", textAlign: "center", paddingVertical: 16 },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  vazio: { color: "#64748B", fontSize: 13 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  itemDesc: { color: "#E2E8F0", fontSize: 14, flex: 1, marginRight: 12 },
  itemDir: { flexDirection: "row", alignItems: "center", gap: 14 },
  itemValor: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  remover: { color: "#F87171", fontSize: 16 },
  cardTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  totalLabel: { color: "#94A3B8", fontSize: 14 },
  totalValor: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  formTitulo: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  campo: { gap: 6 },
  campoLabel: { color: "#94A3B8", fontSize: 12 },
  input: {
    backgroundColor: "#16213a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  botao: {
    backgroundColor: "#22C55E",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 2,
  },
  botaoTexto: { color: "#0F172A", fontSize: 14, fontWeight: "700" },
  desabilitado: { opacity: 0.4 },
});
