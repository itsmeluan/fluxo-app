/**
 * Cliente do Supabase Auth (login/cadastro por e-mail/senha). Usado SÓ para
 * autenticação — os dados continuam indo pelo backend Fastify com o token como
 * Bearer (ver api/client.ts). A sessão é persistida em AsyncStorage e o token
 * é renovado automaticamente.
 *
 * URL e anon key são públicas por design; ficam com fallback no código e podem
 * ser sobrescritas por env (EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY).
 */

import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? "https://yrujsgwyufgrucgyjmez.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlydWpzZ3d5dWZncnVjZ3lqbWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDAwNDIsImV4cCI6MjA5NzM3NjA0Mn0.PMxEjxF_GuSsmPKy5IBg637W22PGbNZFZ1Xmh-3Mur0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
