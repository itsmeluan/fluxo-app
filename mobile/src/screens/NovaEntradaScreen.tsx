import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { createEntry } from "../api/client";
import type { TipoLancamento } from "../types/entry";

/**
 * Registro manual rápido (mockup §3.3 / golden source Fluxo 2). Meta: ≤15s.
 * Reaproveita createEntry() — mesmo caminho de persistência da captura — e ao
 * confirmar navega para a tela de confirmação compartilhada (EntradaConfirmacao).
 */
export default function NovaEntradaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<TipoLancamento>("receita");
  const [de, setDe] = useState("");
  const [salvando, setSalvando] = useState(false);

  const hoje = new Date().toISOString().slice(0, 10);

  async function registrar() {
    const valorNum = Number(valor.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(valorNum) || valorNum <= 0) {
      Alert.alert("Valor inválido", "Informe um valor maior que zero.");
      return;
    }

    setSalvando(true);
    try {
      const entry = await createEntry({
        valor: valorNum,
        data: hoje,
        tipo,
        categoria: null,
        descricao: de.trim() || null,
        // Receita é dividida entre todos os baldes no cálculo; despesa sem balde
        // é debitada do salário. "indefinido" cobre os dois casos do registro manual.
        balde: "indefinido",
        origem: "manual",
      });
      navigation.navigate("EntradaConfirmacao", { entryId: entry.id, valor: valorNum, tipo });
    } catch (err) {
      Alert.alert(
        "Não foi possível registrar",
        err instanceof Error ? err.message : "Erro ao salvar o lançamento."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      <View style={styles.cardValor}>
        <Text style={styles.cardValorLabel}>Valor (R$)</Text>
        <TextInput
          style={styles.bigInput}
          keyboardType="decimal-pad"
          value={valor}
          onChangeText={setValor}
          placeholder="0,00"
          placeholderTextColor="#64748B"
          autoFocus
        />
      </View>

      <View style={styles.toggle}>
        <Pressable
          style={[styles.toggleOpcao, tipo === "receita" && styles.toggleSelecionado]}
          onPress={() => setTipo("receita")}
        >
          <Text style={[styles.toggleTexto, tipo === "receita" && styles.toggleTextoSelecionado]}>Receita</Text>
        </Pressable>
        <Pressable
          style={[styles.toggleOpcao, tipo === "despesa" && styles.toggleSelecionado]}
          onPress={() => setTipo("despesa")}
        >
          <Text style={[styles.toggleTexto, tipo === "despesa" && styles.toggleTextoSelecionado]}>Despesa</Text>
        </Pressable>
      </View>

      <View style={styles.campo}>
        <Text style={styles.campoLabel}>Data</Text>
        <View style={styles.campoFixo}>
          <Text style={styles.campoFixoTexto}>Hoje · {formatHoje(hoje)}</Text>
        </View>
      </View>

      <View style={styles.campo}>
        <Text style={styles.campoLabel}>{tipo === "receita" ? "De (cliente ou descrição)" : "Descrição"}</Text>
        <TextInput
          style={styles.input}
          value={de}
          onChangeText={setDe}
          placeholder={tipo === "receita" ? "Ex: Cliente Acme" : "Ex: Material de escritório"}
          placeholderTextColor="#64748B"
        />
      </View>

      <Pressable
        style={[styles.botao, salvando && styles.desabilitado]}
        onPress={registrar}
        disabled={salvando}
      >
        {salvando ? <ActivityIndicator color="#0F172A" /> : <Text style={styles.botaoTexto}>Registrar</Text>}
      </Pressable>
    </ScrollView>
  );
}

function formatHoje(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
}

const styles = StyleSheet.create({
  tela: { backgroundColor: "#0F172A" },
  container: { padding: 20, gap: 16 },
  cardValor: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  cardValorLabel: { color: "#94A3B8", fontSize: 12 },
  bigInput: { color: "#FFFFFF", fontSize: 34, fontWeight: "800", textAlign: "center", minWidth: 180 },
  toggle: { flexDirection: "row", gap: 10 },
  toggleOpcao: {
    flex: 1,
    backgroundColor: "#16213a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: "center",
  },
  toggleSelecionado: { backgroundColor: "#22C55E", borderColor: "#22C55E" },
  toggleTexto: { color: "#94A3B8", fontSize: 14, fontWeight: "600" },
  toggleTextoSelecionado: { color: "#0F172A", fontWeight: "700" },
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
  campoFixo: {
    backgroundColor: "#16213a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  campoFixoTexto: { color: "#94A3B8", fontSize: 14 },
  botao: {
    backgroundColor: "#22C55E",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  botaoTexto: { color: "#0F172A", fontSize: 15, fontWeight: "700" },
  desabilitado: { opacity: 0.4 },
});
