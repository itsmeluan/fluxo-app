/**
 * Alerta de imposto (mockup §3.13 / US-008). Liga o taxEngine (até aqui órfão)
 * ao saldo do balde de imposto: estima quanto o usuário deveria ter reservado
 * para o mês e diz se o balde cobre.
 *
 * Os valores do taxEngine são SIMPLIFICADOS e não-autoritativos (ver o próprio
 * arquivo) — a resposta carrega `detalhe` deixando isso explícito; a UI deve
 * reforçar que é estimativa.
 */

import type { FastifyInstance } from "fastify";
import { TipoLancamento } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { requireUser } from "../lib/auth";
import { getBucketConfig } from "../lib/bucketConfig";
import { calcularResumo } from "../services/bucketEngine";
import { calcularImposto, type RegimeTributario } from "../services/taxEngine";

const REGIME_INVERSO: Record<string, RegimeTributario> = {
  MEI: "mei",
  SIMPLES: "simples",
  CARNE_LEAO: "carne_leao",
};

export async function impostoRoutes(app: FastifyInstance) {
  app.get("/alerta-imposto", async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const [user, entries, config] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { regime: true } }),
      prisma.entry.findMany({ where: { userId } }),
      getBucketConfig(userId),
    ]);

    const saldoBaldeImposto = calcularResumo(entries, config).baldes.imposto;

    // Sem regime definido (usuário respondeu "não sei" no onboarding) não há
    // como estimar — devolvemos o saldo e sinalizamos para a UI pedir o regime.
    if (!user.regime) {
      return reply.send({
        regime: null,
        saldoBaldeImposto,
        valorReservar: null,
        coberto: null,
        aliquotaEfetiva: null,
        detalhe: "Defina seu regime tributário nas configurações para estimarmos seu imposto.",
      });
    }

    const regime = REGIME_INVERSO[user.regime];
    const agora = new Date();
    const receitaBrutaMes = somaReceitas(entries, agora.getFullYear(), agora.getMonth());
    const receitaBrutaAcumulada12m = somaReceitas12m(entries, agora);

    const calc = calcularImposto({ regime, receitaBrutaMes, receitaBrutaAcumulada12m });

    return reply.send({
      regime,
      saldoBaldeImposto,
      valorReservar: calc.valorReservarImposto,
      coberto: saldoBaldeImposto >= calc.valorReservarImposto,
      aliquotaEfetiva: calc.aliquotaEfetiva,
      detalhe: calc.detalhe,
      receitaBrutaMes,
    });
  });
}

function somaReceitas(entries: { valor: number; tipo: TipoLancamento; data: Date }[], ano: number, mes: number): number {
  const total = entries.reduce((soma, e) => {
    if (e.tipo !== TipoLancamento.RECEITA) return soma;
    const d = new Date(e.data);
    return d.getFullYear() === ano && d.getMonth() === mes ? soma + e.valor : soma;
  }, 0);
  return Math.round(total * 100) / 100;
}

function somaReceitas12m(entries: { valor: number; tipo: TipoLancamento; data: Date }[], ref: Date): number {
  const limite = new Date(ref.getFullYear(), ref.getMonth() - 11, 1);
  const total = entries.reduce((soma, e) => {
    if (e.tipo !== TipoLancamento.RECEITA) return soma;
    return new Date(e.data) >= limite ? soma + e.valor : soma;
  }, 0);
  return Math.round(total * 100) / 100;
}
