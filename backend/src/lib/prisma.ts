/**
 * Cliente Prisma único para todo o backend. Em dev, `tsx watch` recarrega o
 * módulo a cada mudança; o guard em globalThis evita abrir uma nova pool de
 * conexões a cada reload (e estourar o limite do pooler do Supabase).
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
