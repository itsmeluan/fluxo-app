import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { extractCapture } from "../api/client";
import {
  extractionToEditableDraft,
  type EditableDraft,
  type OrigemCaptura,
} from "../types/entry";

/**
 * Tela de Captura — implementa o fluxo descrito na seção 3.13 do golden source:
 * 1. usuário tira foto ou importa imagem da galeria;
 * 2. backend devolve um rascunho (motor de captura, via visão computacional);
 * 3. usuário REVISA E EDITA o rascunho na tela — nada é salvo automaticamente;
 * 4. usuário confirma explicitamente antes de qualquer persistência.
 *
 * Passo 4 hoje é um stub (sem POST /entries implementado ainda — ver README do
 * backend). O ponto desta tela é provar a captura + extração + edição, não a
 * persistência final.
 */
export default function CaptureScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [draft, setDraft] = useState<EditableDraft | null>(null);
  const [avisoUsuario, setAvisoUsuario] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function escolherDaGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert(
        "Permissão necessária",
        "Precisamos acessar suas fotos para importar um recibo ou comprovante."
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets[0]) {
      await processarImagem(resultado.assets[0].uri, "galeria");
    }
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da câmera para fotografar o recibo ou anotação."
      );
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets[0]) {
      await processarImagem(resultado.assets[0].uri, "camera");
    }
  }

  async function processarImagem(uri: string, origem: OrigemCaptura) {
    setImageUri(uri);
    setDraft(null);
    setAvisoUsuario(null);
    setErro(null);
    setCarregando(true);

    try {
      const resposta = await extractCapture({ uri, origem });
      setDraft(extractionToEditableDraft(resposta.draft));
      setAvisoUsuario(resposta.avisoUsuario);
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao processar a imagem."
      );
    } finally {
      setCarregando(false);
    }
  }

  function confirmarLancamento() {
    // STUB: ainda não existe POST /entries no backend. Por ora só provamos que
    // o usuário revisou/editou o rascunho antes de qualquer "salvamento" —
    // o que é o ponto central do princípio de confiança da seção 3.13.
    Alert.alert(
      "Lançamento confirmado (protótipo)",
      `Isso ainda não persiste no backend — é só a prova de que o fluxo captura → rascunho → edição → confirmação explícita funciona.\n\n${JSON.stringify(draft, null, 2)}`
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.instrucao}>
        Fotografe ou importe um recibo, comprovante de PIX ou anotação manuscrita.
      </Text>

      <View style={styles.botoesCaptura}>
        <Pressable style={styles.botaoSecundario} onPress={tirarFoto}>
          <Text style={styles.botaoSecundarioTexto}>📷 Câmera</Text>
        </Pressable>
        <Pressable style={styles.botaoSecundario} onPress={escolherDaGaleria}>
          <Text style={styles.botaoSecundarioTexto}>🖼️ Galeria</Text>
        </Pressable>
      </View>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
      )}

      {carregando && (
        <View style={styles.carregandoBox}>
          <ActivityIndicator color="#22C55E" />
          <Text style={styles.carregandoTexto}>Lendo a imagem...</Text>
        </View>
      )}

      {erro && <Text style={styles.erroTexto}>{erro}</Text>}

      {avisoUsuario && <Text style={styles.avisoTexto}>⚠️ {avisoUsuario}</Text>}

      {draft && (
        <View style={styles.formulario}>
          <Text style={styles.formularioTitulo}>
            Revise antes de confirmar — nada foi salvo ainda
          </Text>

          <Campo label="Valor (R$)">
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={draft.valor}
              onChangeText={(v) => setDraft({ ...draft, valor: v })}
              placeholder="0.00"
              placeholderTextColor="#64748B"
            />
          </Campo>

          <Campo label="Data (YYYY-MM-DD)">
            <TextInput
              style={styles.input}
              value={draft.data}
              onChangeText={(v) => setDraft({ ...draft, data: v })}
              placeholder="2026-06-17"
              placeholderTextColor="#64748B"
            />
          </Campo>

          <Campo label="Tipo">
            <TextInput
              style={styles.input}
              value={draft.tipo}
              onChangeText={(v) => setDraft({ ...draft, tipo: v as EditableDraft["tipo"] })}
              placeholder="receita ou despesa"
              placeholderTextColor="#64748B"
            />
          </Campo>

          <Campo label="Categoria">
            <TextInput
              style={styles.input}
              value={draft.categoria}
              onChangeText={(v) => setDraft({ ...draft, categoria: v })}
              placeholderTextColor="#64748B"
            />
          </Campo>

          <Campo label="Descrição">
            <TextInput
              style={styles.input}
              value={draft.descricao}
              onChangeText={(v) => setDraft({ ...draft, descricao: v })}
              placeholderTextColor="#64748B"
            />
          </Campo>

          <Campo label="Balde sugerido">
            <TextInput
              style={styles.input}
              value={draft.baldeSugerido}
              onChangeText={(v) =>
                setDraft({ ...draft, baldeSugerido: v as EditableDraft["baldeSugerido"] })
              }
              placeholderTextColor="#64748B"
            />
          </Campo>

          <Pressable style={styles.botaoConfirmar} onPress={confirmarLancamento}>
            <Text style={styles.botaoConfirmarTexto}>Confirmar lançamento</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.campoLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F172A",
    padding: 20,
    gap: 16,
    paddingBottom: 48,
  },
  instrucao: {
    color: "#E2E8F0",
    fontSize: 15,
    textAlign: "center",
  },
  botoesCaptura: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  botaoSecundario: {
    backgroundColor: "#1E293B",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  botaoSecundarioTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
  carregandoBox: {
    alignItems: "center",
    gap: 8,
  },
  carregandoTexto: {
    color: "#94A3B8",
  },
  erroTexto: {
    color: "#F87171",
    textAlign: "center",
  },
  avisoTexto: {
    color: "#FBBF24",
    textAlign: "center",
  },
  formulario: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  formularioTitulo: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  campo: {
    gap: 4,
  },
  campoLabel: {
    color: "#94A3B8",
    fontSize: 12,
  },
  input: {
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  botaoConfirmar: {
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  botaoConfirmarTexto: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 15,
  },
});
