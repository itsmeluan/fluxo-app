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
import { updateMe, updateBucketConfig } from "../api/client";
import { marcarOnboardingConcluido } from "../lib/session";
import type { BucketConfig, RegimeTributario } from "../types/entry";

/**
 * Onboarding — wizard de 5 passos (Fluxo 1 do golden source 3.7 / US-001/US-002),
 * espelhando FLUXO-mockup.html. Cada passo é estado interno (não rotas separadas):
 * tipo de trabalho → regime → meta de salário → divisão de baldes → primeira entrada.
 *
 * Ao concluir, persiste perfil (PUT /me) e baldes (PUT /bucket-config) e marca a
 * sessão como onboarded para o app não recomeçar aqui na próxima abertura.
 */

const TIPOS_TRABALHO = [
  "Design",
  "Dev / Tech",
  "Marketing / Conteúdo",
  "Saúde / Bem-estar",
  "Consultoria",
  "Educação",
  "Outro",
];

const REGIMES: { label: string; valor: RegimeTributario | "nao_sei" }[] = [
  { label: "MEI", valor: "mei" },
  { label: "Autônomo (carnê-leão)", valor: "carne_leao" },
  { label: "Simples Nacional", valor: "simples" },
  { label: "Não sei", valor: "nao_sei" },
];

const BALDE_LABELS: { chave: keyof BucketConfig; label: string }[] = [
  { chave: "percentSalario", label: "Salário" },
  { chave: "percentImposto", label: "Imposto" },
  { chave: "percentReserva", label: "Reserva" },
  { chave: "percentReinvestimento", label: "Reinvestimento" },
];

const TOTAL_PASSOS = 5;

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [step, setStep] = useState(0);
  const [salvando, setSalvando] = useState(false);

  const [tipoTrabalho, setTipoTrabalho] = useState<string | null>(null);
  const [regime, setRegime] = useState<RegimeTributario | "nao_sei" | null>(null);
  const [metaSalario, setMetaSalario] = useState("4000");
  const [baldes, setBaldes] = useState<BucketConfig>({
    percentSalario: 0.5,
    percentImposto: 0.15,
    percentReserva: 0.25,
    percentReinvestimento: 0.1,
  });

  const metaNum = Number(metaSalario.replace(/\D/g, "")) || 0;
  const totalBaldes = Math.round(
    (baldes.percentSalario + baldes.percentImposto + baldes.percentReserva + baldes.percentReinvestimento) * 100
  );

  function ajustarBalde(chave: keyof BucketConfig, delta: number) {
    setBaldes((b) => {
      const novo = Math.min(1, Math.max(0, Math.round((b[chave] + delta) * 100) / 100));
      return { ...b, [chave]: novo };
    });
  }

  async function finalizar(destino: "Capture" | "NovaEntrada" | "Dashboard") {
    setSalvando(true);
    try {
      await Promise.all([
        updateMe({
          tipoTrabalho,
          regime,
          metaSalario: metaNum > 0 ? metaNum : null,
        }),
        updateBucketConfig(baldes),
      ]);
      await marcarOnboardingConcluido();

      navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
      if (destino !== "Dashboard") navigation.navigate(destino);
    } catch (err) {
      Alert.alert(
        "Não foi possível concluir",
        err instanceof Error ? err.message : "Erro ao salvar suas preferências."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: TOTAL_PASSOS }).map((_, i) => (
          <View key={i} style={[styles.dot, i <= step && styles.dotOn]} />
        ))}
      </View>

      {step === 0 && (
        <>
          <Text style={styles.titulo}>Qual é seu tipo de trabalho?</Text>
          <Text style={styles.subtitulo}>
            Isso ajuda a sugerir como dividir seu dinheiro. Pode mudar depois.
          </Text>
          <View style={styles.chips}>
            {TIPOS_TRABALHO.map((t) => (
              <Chip key={t} label={t} selecionado={tipoTrabalho === t} onPress={() => setTipoTrabalho(t)} />
            ))}
          </View>
        </>
      )}

      {step === 1 && (
        <>
          <Text style={styles.titulo}>Como você é registrado?</Text>
          <Text style={styles.subtitulo}>
            Usamos isso para estimar seu imposto. É só uma estimativa — confirme com seu contador.
          </Text>
          <View style={styles.chips}>
            {REGIMES.map((r) => (
              <Chip key={r.valor} label={r.label} selecionado={regime === r.valor} onPress={() => setRegime(r.valor)} />
            ))}
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.titulo}>Quanto você quer ganhar por mês?</Text>
          <Text style={styles.subtitulo}>
            Seu "salário-alvo". Usamos para dizer se cada mês foi bom, médio ou difícil.
          </Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardMetaLabel}>Salário-alvo (R$)</Text>
            <TextInput
              style={styles.bigInput}
              keyboardType="numeric"
              value={metaSalario}
              onChangeText={setMetaSalario}
              placeholder="4000"
              placeholderTextColor="#64748B"
            />
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.titulo}>Separamos esses % pra você</Text>
          <Text style={styles.subtitulo}>Sugestão automática. Ajuste antes de confirmar.</Text>
          {BALDE_LABELS.map(({ chave, label }) => (
            <View key={chave} style={styles.stepperRow}>
              <Text style={styles.stepperLabel}>{label}</Text>
              <View style={styles.stepperControls}>
                <Pressable style={styles.stepperBtn} onPress={() => ajustarBalde(chave, -0.05)}>
                  <Text style={styles.stepperBtnTexto}>−</Text>
                </Pressable>
                <Text style={styles.stepperValor}>{Math.round(baldes[chave] * 100)}%</Text>
                <Pressable style={styles.stepperBtn} onPress={() => ajustarBalde(chave, 0.05)}>
                  <Text style={styles.stepperBtnTexto}>+</Text>
                </Pressable>
              </View>
            </View>
          ))}
          <Text style={[styles.total, { color: totalBaldes === 100 ? "#22C55E" : "#FBBF24" }]}>
            Total: {totalBaldes}% {totalBaldes === 100 ? "✓" : "⚠️ idealmente soma 100%"}
          </Text>
        </>
      )}

      {step === 4 && (
        <View style={styles.passoFinal}>
          <Text style={styles.titulo}>Registre sua primeira entrada</Text>
          <Text style={styles.subtitulo}>Ou comece sem dados — seus baldes começam vazios.</Text>
          <Pressable
            style={[styles.botaoPrimario, salvando && styles.desabilitado]}
            onPress={() => finalizar("Capture")}
            disabled={salvando}
          >
            {salvando ? <ActivityIndicator color="#0F172A" /> : <Text style={styles.botaoPrimarioTexto}>📷 Capturar recibo / comprovante</Text>}
          </Pressable>
          <Pressable
            style={[styles.botaoSecundario, salvando && styles.desabilitado]}
            onPress={() => finalizar("NovaEntrada")}
            disabled={salvando}
          >
            <Text style={styles.botaoSecundarioTexto}>✍️ Registrar manualmente</Text>
          </Pressable>
          <Pressable style={styles.linkBtn} onPress={() => finalizar("Dashboard")} disabled={salvando}>
            <Text style={styles.linkBtnTexto}>Começar sem dados →</Text>
          </Pressable>
        </View>
      )}

      {step < 4 && (
        <View style={styles.navBotoes}>
          {step > 0 && (
            <Pressable style={styles.linkBtn} onPress={() => setStep((s) => s - 1)}>
              <Text style={styles.linkBtnTexto}>← Voltar</Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.botaoPrimario, !podeAvancar(step, tipoTrabalho, regime, metaNum) && styles.desabilitado]}
            onPress={() => setStep((s) => s + 1)}
            disabled={!podeAvancar(step, tipoTrabalho, regime, metaNum)}
          >
            <Text style={styles.botaoPrimarioTexto}>Continuar</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

function podeAvancar(
  step: number,
  tipoTrabalho: string | null,
  regime: string | null,
  metaNum: number
): boolean {
  if (step === 0) return tipoTrabalho !== null;
  if (step === 1) return regime !== null;
  if (step === 2) return metaNum > 0;
  return true;
}

function Chip({ label, selecionado, onPress }: { label: string; selecionado: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.chip, selecionado && styles.chipSelecionado]} onPress={onPress}>
      <Text style={[styles.chipTexto, selecionado && styles.chipTextoSelecionado]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tela: { backgroundColor: "#0F172A" },
  container: { padding: 24, gap: 14, minHeight: "100%" },
  dots: { flexDirection: "row", gap: 6, justifyContent: "center", marginBottom: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#16213a" },
  dotOn: { backgroundColor: "#22C55E" },
  titulo: { color: "#FFFFFF", fontSize: 22, fontWeight: "800" },
  subtitulo: { color: "#94A3B8", fontSize: 14, lineHeight: 20 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
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
  cardMeta: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  cardMetaLabel: { color: "#94A3B8", fontSize: 13 },
  bigInput: { color: "#FFFFFF", fontSize: 34, fontWeight: "800", textAlign: "center", minWidth: 180 },
  stepperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  passoFinal: { gap: 14, marginTop: 12 },
  navBotoes: { marginTop: "auto", gap: 8, paddingTop: 16 },
  botaoPrimario: {
    backgroundColor: "#22C55E",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  botaoPrimarioTexto: { color: "#0F172A", fontSize: 15, fontWeight: "700" },
  botaoSecundario: {
    backgroundColor: "#16213a",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  botaoSecundarioTexto: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  desabilitado: { opacity: 0.4 },
  linkBtn: { alignItems: "center", padding: 6 },
  linkBtnTexto: { color: "#22C55E", fontSize: 13, textDecorationLine: "underline" },
});
