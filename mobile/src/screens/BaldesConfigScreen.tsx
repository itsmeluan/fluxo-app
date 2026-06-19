import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { getBucketConfig, getMe, updateBucketConfig, updateMe } from "../api/client";
import { supabase } from "../lib/supabase";
import type { BucketConfig, RegimeTributario } from "../types/entry";

/**
 * Configuração de baldes (mockup §3.8 / golden source 3.5). Edita regime
 * tributário e os percentuais dos quatro baldes pós-onboarding. Usa os mesmos
 * steppers de 5% do onboarding (sem dependência de slider nativo).
 */

const REGIMES: { label: string; valor: RegimeTributario }[] = [
  { label: "MEI", valor: "mei" },
  { label: "Autônomo", valor: "carne_leao" },
  { label: "Simples", valor: "simples" },
];

const BALDES: { chave: keyof BucketConfig; label: string }[] = [
  { chave: "percentSalario", label: "Salário" },
  { chave: "percentImposto", label: "Imposto" },
  { chave: "percentReserva", label: "Reserva" },
  { chave: "percentReinvestimento", label: "Reinvestimento" },
];

export default function BaldesConfigScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [regime, setRegime] = useState<RegimeTributario | null>(null);
  const [baldes, setBaldes] = useState<BucketConfig>({
    percentSalario: 0.5,
    percentImposto: 0.15,
    percentReserva: 0.25,
    percentReinvestimento: 0.1,
  });

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      Promise.all([getMe(), getBucketConfig()])
        .then(([me, cfg]) => {
          if (!ativo) return;
          setRegime(me.regime);
          setBaldes(cfg);
          setErro(null);
        })
        .catch((err) => ativo && setErro(err instanceof Error ? err.message : "Erro ao carregar."))
        .finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, [])
  );

  const total = Math.round(
    (baldes.percentSalario + baldes.percentImposto + baldes.percentReserva + baldes.percentReinvestimento) * 100
  );

  function ajustar(chave: keyof BucketConfig, delta: number) {
    setBaldes((b) => ({
      ...b,
      [chave]: Math.min(1, Math.max(0, Math.round((b[chave] + delta) * 100) / 100)),
    }));
  }

  async function salvar() {
    setSalvando(true);
    try {
      await Promise.all([updateBucketConfig(baldes), regime ? updateMe({ regime }) : Promise.resolve()]);
      Alert.alert("Baldes atualizados ✓");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color="#22C55E" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      {erro && <Text style={styles.erro}>{erro}</Text>}

      <View style={styles.campo}>
        <Text style={styles.campoLabel}>Regime tributário</Text>
        <View style={styles.chips}>
          {REGIMES.map((r) => (
            <Pressable
              key={r.valor}
              style={[styles.chip, regime === r.valor && styles.chipSelecionado]}
              onPress={() => setRegime(r.valor)}
            >
              <Text style={[styles.chipTexto, regime === r.valor && styles.chipTextoSelecionado]}>{r.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {BALDES.map(({ chave, label }) => (
        <View key={chave} style={styles.stepperRow}>
          <Text style={styles.stepperLabel}>{label}</Text>
          <View style={styles.stepperControls}>
            <Pressable style={styles.stepperBtn} onPress={() => ajustar(chave, -0.05)}>
              <Text style={styles.stepperBtnTexto}>−</Text>
            </Pressable>
            <Text style={styles.stepperValor}>{Math.round(baldes[chave] * 100)}%</Text>
            <Pressable style={styles.stepperBtn} onPress={() => ajustar(chave, 0.05)}>
              <Text style={styles.stepperBtnTexto}>+</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Text style={[styles.total, { color: total === 100 ? "#22C55E" : "#FBBF24" }]}>
        Total: {total}% {total === 100 ? "✓" : "⚠️ idealmente soma 100%"}
      </Text>

      <Pressable style={[styles.botao, salvando && styles.desabilitado]} onPress={salvar} disabled={salvando}>
        {salvando ? <ActivityIndicator color="#0F172A" /> : <Text style={styles.botaoTexto}>Salvar alterações</Text>}
      </Pressable>

      <Pressable style={styles.sair} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.sairTexto}>Sair da conta</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { backgroundColor: "#0F172A" },
  container: { padding: 20, gap: 12, paddingBottom: 40 },
  centro: { flex: 1, backgroundColor: "#0F172A", alignItems: "center", justifyContent: "center" },
  erro: { color: "#F87171", textAlign: "center" },
  campo: { gap: 8 },
  campoLabel: { color: "#94A3B8", fontSize: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: "#16213a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  chipSelecionado: { backgroundColor: "#22C55E", borderColor: "#22C55E" },
  chipTexto: { color: "#94A3B8", fontSize: 13 },
  chipTextoSelecionado: { color: "#0F172A", fontWeight: "700" },
  stepperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 2,
  },
  stepperLabel: { color: "#E2E8F0", fontSize: 15, fontWeight: "600" },
  stepperControls: { flexDirection: "row", alignItems: "center", gap: 14 },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnTexto: { color: "#22C55E", fontSize: 22, fontWeight: "700" },
  stepperValor: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", minWidth: 44, textAlign: "center" },
  total: { fontSize: 13, textAlign: "center", marginTop: 4 },
  botao: {
    backgroundColor: "#22C55E",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  botaoTexto: { color: "#0F172A", fontSize: 15, fontWeight: "700" },
  desabilitado: { opacity: 0.4 },
  sair: { alignItems: "center", paddingVertical: 14, marginTop: 4 },
  sairTexto: { color: "#F87171", fontSize: 14, fontWeight: "600" },
});
