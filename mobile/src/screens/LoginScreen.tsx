import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../lib/supabase";

/**
 * Login / cadastro por e-mail e senha (Supabase Auth — Épico 1). Em caso de
 * sucesso, o onAuthStateChange no RootNavigation troca para o app autenticado;
 * por isso aqui não navegamos manualmente. Se o projeto exigir confirmação de
 * e-mail, o cadastro não cria sessão na hora — mostramos um aviso pedindo a
 * confirmação.
 */
export default function LoginScreen() {
  const [modo, setModo] = useState<"entrar" | "cadastrar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar() {
    setErro(null);
    setMensagem(null);
    if (!email.trim() || senha.length < 6) {
      setErro("Informe um e-mail válido e uma senha de ao menos 6 caracteres.");
      return;
    }

    setCarregando(true);
    try {
      if (modo === "cadastrar") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: senha });
        if (error) {
          setErro(traduzirErro(error.message));
        } else if (!data.session) {
          setMensagem("Conta criada! Enviamos um e-mail de confirmação — confirme para entrar.");
          setModo("entrar");
        }
        // se há sessão, o onAuthStateChange cuida da navegação
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
        if (error) setErro(traduzirErro(error.message));
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.conteudo}>
        <Text style={styles.logo}>FLUXO</Text>
        <Text style={styles.tagline}>Seu salário, mesmo sem patrão.</Text>

        <View style={styles.card}>
          <View style={styles.campo}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="voce@email.com"
              placeholderTextColor="#64748B"
            />
          </View>
          <View style={styles.campo}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#64748B"
            />
          </View>

          {erro && <Text style={styles.erro}>{erro}</Text>}
          {mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}

          <Pressable
            style={[styles.botao, carregando && styles.desabilitado]}
            onPress={enviar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#0F172A" />
            ) : (
              <Text style={styles.botaoTexto}>{modo === "entrar" ? "Entrar" : "Criar conta"}</Text>
            )}
          </Pressable>
        </View>

        <Pressable
          onPress={() => {
            setModo((m) => (m === "entrar" ? "cadastrar" : "entrar"));
            setErro(null);
            setMensagem(null);
          }}
        >
          <Text style={styles.alternar}>
            {modo === "entrar" ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function traduzirErro(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return "E-mail ou senha incorretos.";
  if (/email not confirmed/i.test(msg)) return "Confirme seu e-mail antes de entrar.";
  if (/user already registered/i.test(msg)) return "Já existe uma conta com esse e-mail.";
  if (/password should be at least/i.test(msg)) return "A senha deve ter ao menos 6 caracteres.";
  return msg;
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#0F172A" },
  conteudo: { flex: 1, justifyContent: "center", padding: 24, gap: 14 },
  logo: { color: "#FFFFFF", fontSize: 42, fontWeight: "800", textAlign: "center" },
  tagline: { color: "#94A3B8", fontSize: 14, textAlign: "center", marginBottom: 12 },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  campo: { gap: 6 },
  label: { color: "#94A3B8", fontSize: 12 },
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
  erro: { color: "#F87171", fontSize: 13 },
  mensagem: { color: "#22C55E", fontSize: 13 },
  botao: { backgroundColor: "#22C55E", paddingVertical: 14, borderRadius: 14, alignItems: "center", marginTop: 2 },
  botaoTexto: { color: "#0F172A", fontSize: 15, fontWeight: "700" },
  desabilitado: { opacity: 0.5 },
  alternar: { color: "#22C55E", fontSize: 13, textAlign: "center", textDecorationLine: "underline" },
});
