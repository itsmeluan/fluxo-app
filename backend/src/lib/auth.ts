/**
 * Autenticação (Épico 1). O mobile autentica no Supabase Auth (e-mail/senha) e
 * manda o access token como `Authorization: Bearer <token>`. Aqui validamos o
 * token chamando o endpoint do Supabase e vinculamos a linha de `User` do app
 * ao uid do Auth (User.id === auth.uid). Substitui o antigo devUser.ts.
 *
 * Validamos via /auth/v1/user (em vez de verificar o JWT localmente) para não
 * depender do JWT secret nem de config de JWKS — com um cache curto em memória
 * para não chamar o Supabase a cada request. Chaves anon/publishable são
 * públicas por design; por isso há fallback no código (env tem prioridade).
 */

import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "./prisma";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://yrujsgwyufgrucgyjmez.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlydWpzZ3d5dWZncnVjZ3lqbWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDAwNDIsImV4cCI6MjA5NzM3NjA0Mn0.PMxEjxF_GuSsmPKy5IBg637W22PGbNZFZ1Xmh-3Mur0";

interface AuthUser {
  sub: string;
  email: string;
}

const TTL_MS = 60_000;
const tokenCache = new Map<string, { user: AuthUser; expiraEm: number }>();
const usuariosGarantidos = new Set<string>();

async function validarToken(token: string): Promise<AuthUser | null> {
  const agora = Date.now();
  const cached = tokenCache.get(token);
  if (cached && cached.expiraEm > agora) return cached.user;

  const resp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) return null;

  const data = (await resp.json()) as { id?: string; email?: string };
  if (!data.id) return null;

  const user: AuthUser = { sub: data.id, email: data.email ?? "" };
  tokenCache.set(token, { user, expiraEm: agora + TTL_MS });
  return user;
}

/**
 * Valida o Bearer token da requisição e devolve o userId (= auth.uid), criando
 * a linha de `User` na primeira vez. Em caso de token ausente/ inválido, já
 * responde 401 e devolve null — o chamador deve `return` imediatamente.
 */
export async function requireUser(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<string | null> {
  const header = request.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    reply.status(401).send({ erro: "Não autenticado. Faça login novamente." });
    return null;
  }

  const authUser = await validarToken(token);
  if (!authUser) {
    reply.status(401).send({ erro: "Sessão inválida ou expirada. Faça login novamente." });
    return null;
  }

  if (!usuariosGarantidos.has(authUser.sub)) {
    await prisma.user.upsert({
      where: { id: authUser.sub },
      update: {},
      create: {
        id: authUser.sub,
        email: authUser.email || `${authUser.sub}@sem-email.fluxo`,
      },
    });
    usuariosGarantidos.add(authUser.sub);
  }

  return authUser.sub;
}
