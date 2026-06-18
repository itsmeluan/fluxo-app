import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { getMe, listEntries } from "../api/client";
import type { BaldeSaldos, EntryRecord, EntryResumo, Perfil } from "../types/entry";

/**
 * Dashboard / Home (golden source 3.4/3.5, US-004/US-005) — visual alinhado ao
 * FLUXO-mockup.html. Número principal = balde "Salário" (quanto o usuário pode
 * se pagar), com pill de status e barra de progresso vs. a meta do perfil.
 *
 * Os baldes vêm já calculados pelo backend (GET /entries → resumo); a meta vem
 * do perfil (GET /me). Tudo recarrega ao ganhar foco (atualiza após uma captura).
 */
export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [entries, setEntries] = useState<EntryRecord[]>([]);
  const [resumo, setResumo] = useState<EntryResumo | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const [dados, me] = await Promise.all([listEntries(), getMe()]);
      setEntries(dados.entries);
      setResumo(dados.resumo);
      setPerfil(me);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar os dados.");
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

  async function aoPuxar() {
    setAtualizando(true);
    await carregar();
    setAtualizando(false);
  }

  const salario = resumo?.baldes.salario ?? 0;
  const meta = perfil?.metaSalario ?? null;
  const pct = meta && meta > 0 ? Math.round((salario / meta) * 100) : null;
  const status = statusDaMeta(pct);

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={atualizando} onRefresh={aoPuxar} tintColor="#22C55E" />
      }
    >
      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator color="#22C55E" />
        </View>
      ) : erro ? (
        <Text style={styles.erro}>{erro}</Text>
      ) : (
        <>
          <Text style={styles.saudacao}>Olá 👋</Text>

          <View style={styles.cardSalario}>
            <Text style={styles.cardSalarioLabel}>Salário disponível</Text>
            <Text style={styles.valorSalario}>{formatBRL(salario)}</Text>
            {pct !== null && (
              <>
                <View style={[styles.pill, { backgroundColor: status.fundo }]}>
                  <Text style={[styles.pillTexto, { color: status.cor }]}>{pct}% da sua meta</Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[styles.fill, { width: `${Math.min(100, pct)}%`, backgroundColor: status.cor }]}
                  />
                </View>
              </>
            )}
            {pct === null && (
              <Text style={styles.semMeta}>Defina sua meta de salário no onboarding para acompanhar o progresso.</Text>
            )}
          </View>

          <View style={styles.cardFolego}>
            <View style={styles.folegoTopo}>
              <Text style={styles.folegoTitulo}>🛟 Fôlego financeiro</Text>
              <Text style={styles.folegoEmBreve}>em breve</Text>
            </View>
            <Text style={styles.folegoSub}>
              Quando você cadastrar suas despesas fixas, mostramos por quantos meses dá pra se manter
              sem nenhum projeto novo.
            </Text>
          </View>

          {resumo && (
            <View style={styles.bucketRow}>
              <BucketCard emoji="🧾" label="Imposto" valor={resumo.baldes.imposto} />
              <BucketCard emoji="🛡️" label="Reserva" valor={resumo.baldes.reserva} />
              <BucketCard emoji="🌱" label="Reinvest." valor={resumo.baldes.reinvestimento} />
            </View>
          )}

          {resumo && (
            <View style={styles.totais}>
              <Totalzinho rotulo="Recebido" valor={resumo.totalReceitas} cor="#22C55E" />
              <Totalzinho rotulo="Gasto" valor={resumo.totalDespesas} cor="#F87171" />
              <Totalzinho rotulo="Saldo" valor={resumo.saldo} cor="#E2E8F0" />
            </View>
          )}

          <Pressable style={styles.botaoCaptura} onPress={() => navigation.navigate("Capture")}>
            <Text style={styles.botaoCapturaTexto}>📷 Capturar recibo / comprovante</Text>
          </Pressable>

          <Text style={styles.tituloLista}>Lançamentos</Text>
          {entries.length === 0 ? (
            <Text style={styles.vazio}>
              Nenhum lançamento ainda. Toque em capturar para registrar o primeiro.
            </Text>
          ) : (
            entries.map((entry) => <LinhaEntry key={entry.id} entry={entry} />)
          )}
        </>
      )}
    </ScrollView>
  );
}

function statusDaMeta(pct: number | null) {
  if (pct === null || pct >= 90) return { cor: "#22C55E", fundo: "rgba(34,197,94,0.15)" };
  if (pct >= 50) return { cor: "#FBBF24", fundo: "rgba(251,191,36,0.15)" };
  return { cor: "#F87171", fundo: "rgba(248,113,113,0.15)" };
}

function BucketCard({ emoji, label, valor }: { emoji: string; label: string; valor: number }) {
  return (
    <View style={styles.bucket}>
      <Text style={styles.bucketEmoji}>{emoji}</Text>
      <Text style={styles.bucketLabel}>{label}</Text>
      <Text style={styles.bucketValor}>{formatBRL(valor)}</Text>
    </View>
  );
}

function Totalzinho({ rotulo, valor, cor }: { rotulo: string; valor: number; cor: string }) {
  return (
    <View style={styles.totalItem}>
      <Text style={styles.totalRotulo}>{rotulo}</Text>
      <Text style={[styles.totalValor, { color: cor }]}>{formatBRL(valor)}</Text>
    </View>
  );
}

function LinhaEntry({ entry }: { entry: EntryRecord }) {
  const receita = entry.tipo === "RECEITA";
  const titulo = entry.descricao || entry.categoria || (receita ? "Receita" : "Despesa");
  return (
    <View style={styles.linha}>
      <View style={styles.linhaEsq}>
        <Text style={styles.linhaTitulo} numberOfLines={1}>
          {titulo}
        </Text>
        <Text style={styles.linhaData}>{formatData(entry.data)}</Text>
      </View>
      <Text style={[styles.linhaValor, { color: receita ? "#22C55E" : "#F87171" }]}>
        {receita ? "+" : "−"}
        {formatBRL(entry.valor)}
      </Text>
    </View>
  );
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatData(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

const styles = StyleSheet.create({
  tela: { backgroundColor: "#0F172A" },
  container: { padding: 20, gap: 12, paddingBottom: 40 },
  centro: { paddingVertical: 48, alignItems: "center" },
  erro: { color: "#F87171", textAlign: "center", paddingVertical: 24 },
  saudacao: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginTop: 4 },
  cardSalario: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardSalarioLabel: { color: "#94A3B8", fontSize: 13 },
  valorSalario: { color: "#22C55E", fontSize: 40, fontWeight: "800" },
  pill: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 999 },
  pillTexto: { fontSize: 12, fontWeight: "700" },
  track: { width: "100%", height: 8, backgroundColor: "#16213a", borderRadius: 99, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 99 },
  semMeta: { color: "#64748B", fontSize: 12, textAlign: "center" },
  cardFolego: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  folegoTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  folegoTitulo: { color: "#E2E8F0", fontSize: 14, fontWeight: "600" },
  folegoEmBreve: { color: "#64748B", fontSize: 11 },
  folegoSub: { color: "#64748B", fontSize: 12, lineHeight: 17 },
  bucketRow: { flexDirection: "row", gap: 10 },
  bucket: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  bucketEmoji: { fontSize: 18 },
  bucketLabel: { fontSize: 11, color: "#94A3B8" },
  bucketValor: { fontSize: 13, color: "#FFFFFF", fontWeight: "700" },
  totais: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: 14,
  },
  totalItem: { alignItems: "center", gap: 2 },
  totalRotulo: { color: "#94A3B8", fontSize: 12 },
  totalValor: { fontSize: 15, fontWeight: "700" },
  botaoCaptura: {
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  botaoCapturaTexto: { color: "#0F172A", fontSize: 15, fontWeight: "700" },
  tituloLista: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", marginTop: 12 },
  vazio: { color: "#94A3B8", fontSize: 14, paddingVertical: 8 },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  linhaEsq: { flex: 1, marginRight: 12, gap: 2 },
  linhaTitulo: { color: "#E2E8F0", fontSize: 14, fontWeight: "600" },
  linhaData: { color: "#64748B", fontSize: 12 },
  linhaValor: { fontSize: 15, fontWeight: "700" },
});
