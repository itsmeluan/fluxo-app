/**
 * Rotas de perfil do usuário e configuração de baldes — alimentam o onboarding
 * (Fluxo 1 / US-001/US-002) e a tela de configuração de baldes (golden source 3.5).
 *
 * Sem auth ainda: tudo opera sobre o dev user (ver lib/devUser.ts). Quando o
 * Épico 1 (auth) chegar, é só trocar getDevUserId() pelo usuário da requisição.
 */

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { RegimeTributario } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { getDevUserId } from "../lib/devUser";
import { getBucketConfig } from "../lib/bucketConfig";

const REGIME_MAP: Record<string, RegimeTributario> = {
  mei: RegimeTributario.MEI,
  simples: RegimeTributario.SIMPLES,
  carne_leao: RegimeTributario.CARNE_LEAO,
};

// app -> Prisma na entrada; Prisma -> app na saída (mantém o contrato minúsculo no mobile)
const REGIME_INVERSO: Record<RegimeTributario, string> = {
  MEI: "mei",
  SIMPLES: "simples",
  CARNE_LEAO: "carne_leao",
};

const meSchema = z.object({
  nome: z.string().trim().min(1).nullish(),
  // "nao_sei" e null caem em regime = null (o usuário não soube responder)
  regime: z.enum(["mei", "simples", "carne_leao", "nao_sei"]).nullish(),
  tipoTrabalho: z.string().trim().min(1).nullish(),
  metaSalario: z.number().positive().nullish(),
});

const pct = z.number().min(0).max(1);
const bucketSchema = z.object({
  percentSalario: pct,
  percentImposto: pct,
  percentReserva: pct,
  percentReinvestimento: pct,
});

export async function profileRoutes(app: FastifyInstance) {
  app.get("/me", async (_request, reply) => {
    const userId = await getDevUserId();
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nome: true,
        regime: true,
        tipoTrabalho: true,
        metaSalario: true,
      },
    });
    return reply.send({
      ...user,
      regime: user.regime ? REGIME_INVERSO[user.regime] : null,
    });
  });

  app.put("/me", async (request, reply) => {
    const parsed = meSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        erro: "Dados de perfil inválidos.",
        detalhes: parsed.error.flatten().fieldErrors,
      });
    }
    const body = parsed.data;
    const userId = await getDevUserId();

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(body.nome !== undefined ? { nome: body.nome } : {}),
        ...(body.regime !== undefined
          ? { regime: body.regime && body.regime !== "nao_sei" ? REGIME_MAP[body.regime] : null }
          : {}),
        ...(body.tipoTrabalho !== undefined ? { tipoTrabalho: body.tipoTrabalho } : {}),
        ...(body.metaSalario !== undefined ? { metaSalario: body.metaSalario } : {}),
      },
      select: {
        id: true,
        email: true,
        nome: true,
        regime: true,
        tipoTrabalho: true,
        metaSalario: true,
      },
    });

    return reply.send({
      ...user,
      regime: user.regime ? REGIME_INVERSO[user.regime] : null,
    });
  });

  app.get("/bucket-config", async (_request, reply) => {
    const userId = await getDevUserId();
    const config = await getBucketConfig(userId);
    return reply.send(config);
  });

  app.put("/bucket-config", async (request, reply) => {
    const parsed = bucketSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        erro: "Percentuais de baldes inválidos (cada um deve estar entre 0 e 1).",
        detalhes: parsed.error.flatten().fieldErrors,
      });
    }
    const userId = await getDevUserId();

    // garante que a linha exista antes do update (mesmo padrão de getBucketConfig)
    await getBucketConfig(userId);
    const config = await prisma.bucketConfig.update({
      where: { userId },
      data: parsed.data,
      select: {
        percentSalario: true,
        percentImposto: true,
        percentReserva: true,
        percentReinvestimento: true,
      },
    });

    return reply.send(config);
  });
}
