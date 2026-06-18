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
import { listEntries } from "../api/client";
import type { BaldeSaldos, EntryRecord, EntryResumo } from "../types/entry";

/**
 * Dashboard (golden source 3.4/3.5, US-005/US-004). O número principal é o
 * balde "Salário" — quanto o usuário pode se pagar. Abaixo, os outros baldes,
 * os totais do período e a lista de lançamentos.
 *
 * Os baldes vêm já calculados pelo backend (GET /entries -> resumo): cada
 * receita é dividida entre os baldes pelos percentuais configurados.
 */
export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [entries, setEntries] = useState<EntryRecord[]>([]);
  const [resumo, setResumo] = useState<EntryResumo | null>(null);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const dados = await listEntries();
      setEntries(dados.entries);
      setResumo(dados.resumo);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar os dados.");
    }
  }, []);

  // Recarrega toda vez que a tela ganha foco — inclusive ao voltar da Captura
  // depois de confirmar um lançamento.
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
          <Text style={styles.rotuloSalario}>Salário disponível</Text>
          <Text style={styles.valorSalario}>{formatBRL(resumo?.baldes.salario ?? 0)}</Text>

          {resumo && <BaldesGrid baldes={resumo.baldes} />}

          {resumo && (
            <View style={styles.totais}>
              <Totalzinho rotulo="Recebido" valor={resumo.totalReceitas} cor="#22C55E" />
              <Totalzinho rotulo="Gasto" valor={resumo.totalDespesas} cor="#F87171" />
              <Totalzinho rotulo="Saldo" valor={resumo.saldo} cor="#E2E8F0" />
            </View>
          )}

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

      <Pressable style={styles.botaoCaptura} onPress={() => navigation.navigate("Capture")}>
        <Text style={styles.botaoCapturaTexto}>📷 Capturar recibo / comprovante</Text>
      </Pressable>
    </ScrollView>
  );
}

function BaldesGrid({ baldes }: { baldes: BaldeSaldos }) {
  return (
    <View style={styles.baldesGrid}>
      <BaldeCard rotulo="Imposto" valor={baldes.imposto} />
      <BaldeCard rotulo="Reserva" valor={baldes.reserva} />
      <BaldeCard rotulo="Reinvestimento" valor={baldes.reinvestimento} />
      <BaldeCard rotulo="Salário" valor={baldes.salario} />
    </View>
  );
}

function BaldeCard({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <View style={styles.baldeCard}>
      <Text style={styles.baldeRotulo}>{rotulo}</Text>
      <Text style={styles.baldeValor}>{formatBRL(valor)}</Text>
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
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatData(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

const styles = StyleSheet.create({
  tela: {
    backgroundColor: "#0F172A",
  },
  container: {
    padding: 20,
    gap: 12,
    paddingBottom: 40,
  },
  centro: {
    paddingVertical: 48,
    alignItems: "center",
  },
  erro: {
    color: "#F87171",
    textAlign: "center",
    paddingVertical: 24,
  },
  rotuloSalario: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  valorSalario: {
    color: "#22C55E",
    fontSize: 40,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  baldesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  baldeCard: {
    flexGrow: 1,
    flexBasis: "47%",
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  baldeRotulo: {
    color: "#94A3B8",
    fontSize: 12,
  },
  baldeValor: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  totais: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: 14,
    marginTop: 4,
  },
  totalItem: {
    alignItems: "center",
    gap: 2,
  },
  totalRotulo: {
    color: "#94A3B8",
    fontSize: 12,
  },
  totalValor: {
    fontSize: 15,
    fontWeight: "700",
  },
  tituloLista: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },
  vazio: {
    color: "#94A3B8",
    fontSize: 14,
    paddingVertical: 8,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  linhaEsq: {
    flex: 1,
    marginRight: 12,
    gap: 2,
  },
  linhaTitulo: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
  },
  linhaData: {
    color: "#64748B",
    fontSize: 12,
  },
  linhaValor: {
    fontSize: 15,
    fontWeight: "700",
  },
  botaoCaptura: {
    backgroundColor: "#22C55E",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },
  botaoCapturaTexto: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
});
