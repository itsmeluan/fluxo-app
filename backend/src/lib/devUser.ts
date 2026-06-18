/**
 * Ponte temporária até existir autenticação (ver golden source 3.6, Épico 1 —
 * ainda não implementado). Todo `Entry` exige um `userId`, mas o app ainda não
 * tem login. Enquanto isso, todas as entradas confirmadas no protótipo são
 * atribuídas a um único usuário de desenvolvimento, criado sob demanda.
 *
 * TODO(auth): trocar por o usuário autenticado da requisição quando o Épico 1
 * (onboarding/auth) for implementado. Este arquivo inteiro deve sumir então.
 */

import { prisma } from "./prisma";

const DEV_USER_EMAIL = "dev@fluxo.app";

let cachedDevUserId: string | null = null;

export async function getDevUserId(): Promise<string> {
  if (cachedDevUserId) return cachedDevUserId;

  const user = await prisma.user.upsert({
    where: { email: DEV_USER_EMAIL },
    update: {},
    create: { email: DEV_USER_EMAIL, nome: "Usuário de desenvolvimento" },
  });

  cachedDevUserId = user.id;
  return user.id;
}
