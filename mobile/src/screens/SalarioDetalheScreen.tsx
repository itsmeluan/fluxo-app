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
import { useFocusEffect } from "@react-navigation/native";
import { createEntry, getMe, listEntries } from "../api/client";
import type { EntryRecord, EntryResumo, Perfil } from "../types/entry";

/**
 * Detalhe do salário (mockup §3.6 / golden source Fluxo 3 — "quanto posso me
 * pagar este mês"). O botão "Quero me pagar agora" registra uma RETIRADA:
 * uma despesa no balde Salário (descrição "Retirada (pró-labore)"). O motor de
 * baldes já debita o salário nesse caso, então o saldo disponível fica correto
 * sem nenhum conceito novo no modelo de dados.
 */
export default function SalarioDetalheScreen() {
  const [carregando, setCarregando] = useState(true);
  const [registrando, setRegistrando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resumo, setResumo] = useState<EntryResumo | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [entries, setEntries] = useState<EntryRecord[]>([]);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const [dados, me] = await Promise.all([listEntries(), getMe()]);
      setResumo(dados.resumo);
      setPerfil(me);
      setEntries(dados.entries);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      carregar().finally(() => ativo && setCarregando(false));
      return () => {
        ativo = false;
      };
    }, [carregar])
  );

  const salario = resumo?.baldes.salario ?? 0;
  const meta = perfil?.metaSalario ?? null;
  const pct = meta && meta > 0 ? Math.round((salario / meta) * 100) : null;
  const entradasNoMes = contarReceitasDoMes(entries);

  function meParaPagar() {
    if (salario <= 0) {
      Alert.alert("Sem saldo", "Seu balde de salário não tem saldo disponível para retirar.");
      return;
    }
    Alert.alert(
      "Registrar retirada",
      `Vamos registrar uma retirada de ${formatBRL(salario)} do seu balde de Salário. Isso representa o que você transferiu para sua conta pessoal.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: registrarRetirada },
      ]
    );
  }

  async function registrarRetirada() {
    setRegistrando(true);
    try {
      await createEntry({
        valor: salario,
        data: new Date().toISOString().slice(0, 10),
        tipo: "despesa",
        categoria: "retirada",
        descricao: "Retirada (pró-labore)",
        balde: "salario",
        origem: "manual",
      });
      await carregar();
      Alert.alert("Retirada registrada ✓", "Seu balde de Salário foi atualizado.");
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Não foi possível registrar.");
    } finally {
      setRegistrando(false);
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

      <View style={styles.card}>
        <Text style={styles.valor}>{formatBRL(salario)}</Text>
        {pct !== null ? (
          <Text style={styles.muted}>
            {pct}% do seu alvo de {formatBRL(meta as number)}
          </Text>
        ) : (
          <Text style={styles.muted}>Defina sua meta de salário para acompanhar o progresso.</Text>
        )}
        {pct !== null && (
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.min(100, pct)}%` }]} />
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.linha}>
          Já {entradasNoMes === 1 ? "foi" : "foram"} <Text style={styles.bold}>{entradasNoMes}</Text>{" "}
          {entradasNoMes === 1 ? "entrada" : "entradas"} de receita neste mês.
        </Text>
        <Text style={styles.linha}>
          Seu balde de imposto tem <Text style={styles.bold}>{formatBRL(resumo?.baldes.imposto ?? 0)}</Text> guardados.
        </Text>
        <Text style={styles.linha}>
          Sua reserva tem <Text style={styles.bold}>{formatBRL(resumo?.baldes.reserva ?? 0)}</Text>.
        </Text>
      </View>

      <View style={styles.flex} />

      <Pressable
        style={[styles.botao, (registrando || salario <= 0) && styles.desabilitado]}
        onPress={meParaPagar}
        disabled={registrando || salario <= 0}
      >
        {registrando ? <ActivityIndicator color="#0F172A" /> : <Text style={styles.botaoTexto}>Quero me pagar agora</Text>}
      </Pressable>
    </ScrollView>
  );
}

function contarReceitasDoMes(entries: EntryRecord[]): number {
  const agora = new Date();
  return entries.filter((e) => {
    if (e.tipo !== "RECEITA") return false;
    const d = new Date(e.data);
    return d.getFullYear() === agora.getFullYear() && d.getMonth() === agora.getMonth();
  }).length;
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const styles = StyleSheet.create({
  tela: { backgroundColor: "#0F172A" },
  container: { padding: 20, gap: 14, flexGrow: 1 },
  centro: { flex: 1, backgroundColor: "#0F172A", alignItems: "center", justifyContent: "center" },
  erro: { color: "#F87171", textAlign: "center" },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  valor: { color: "#22C55E", fontSize: 40, fontWeight: "800", textAlign: "center" },
  muted: { color: "#94A3B8", fontSize: 13, textAlign: "center" },
  track: { width: "100%", height: 8, backgroundColor: "#16213a", borderRadius: 99, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 99, backgroundColor: "#22C55E" },
  linha: { color: "#E2E8F0", fontSize: 14, lineHeight: 20 },
  bold: { fontWeight: "800", color: "#FFFFFF" },
  flex: { flex: 1 },
  botao: { backgroundColor: "#22C55E", paddingVertical: 15, borderRadius: 14, alignItems: "center" },
  botaoTexto: { color: "#0F172A", fontSize: 15, fontWeight: "700" },
  desabilitado: { opacity: 0.4 },
});
