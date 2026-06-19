/**
 * Rota de persistência de lançamentos. Ver golden source, seções 3.13 e 3.6 (US-003).
 *
 * POST /entries
 *   Cria um lançamento JÁ CONFIRMADO pelo usuário. É o passo seguinte ao motor
 *   de captura: a tela de Captura mostra o rascunho extraído, o usuário revisa /
 *   edita e só então chama esta rota.
 *
 * Princípio de confiança (3.13): o motor de captura (POST /capture/extract)
 * nunca escreve no banco. A escrita acontece SÓ aqui, e só porque o usuário
 * confirmou explicitamente na UI — por isso `confirmadoPeloUsuario` é setado
 * como `true` neste ponto (e em nenhum outro lugar do código).
 */

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  BaldeTipo,
  OrigemLancamento,
  TipoLancamento,
} from "@prisma/client";
import { prisma } from "../lib/prisma";
import { requireUser } from "../lib/auth";
import { getBucketConfig } from "../lib/bucketConfig";
import { calcularResumo } from "../services/bucketEngine";

// O app envia os enums em minúsculas (espelhando os tipos do motor de captura);
// o schema Prisma usa MAIÚSCULAS. Estes mapas são a fronteira de tradução.
const TIPO_MAP: Record<string, TipoLancamento> = {
  receita: TipoLancamento.RECEITA,
  despesa: TipoLancamento.DESPESA,
};

const BALDE_MAP: Record<string, BaldeTipo | null> = {
  salario: BaldeTipo.SALARIO,
  imposto: BaldeTipo.IMPOSTO,
  reserva: BaldeTipo.RESERVA,
  reinvestimento: BaldeTipo.REINVESTIMENTO,
  indefinido: null, // o usuário não escolheu um balde — fica null no banco
};

const ORIGEM_MAP: Record<string, OrigemLancamento> = {
  camera: OrigemLancamento.CAMERA,
  galeria: OrigemLancamento.GALERIA,
  import: OrigemLancamento.IMPORT,
  manual: OrigemLancamento.MANUAL,
};

const bodySchema = z.object({
  valor: z.number().positive("valor deve ser maior que zero"),
  // aceita "YYYY-MM-DD" ou ISO 8601 completo
  data: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "data inválida — use YYYY-MM-DD ou ISO 8601",
  }),
  tipo: z.enum(["receita", "despesa"]),
  categoria: z.string().trim().min(1).nullish(),
  descricao: z.string().trim().min(1).nullish(),
  balde: z
    .enum(["salario", "imposto", "reserva", "reinvestimento", "indefinido"])
    .default("indefinido"),
  origem: z.enum(["camera", "galeria", "import", "manual"]),
  imagemUrl: z.string().url().nullish(),
  confiancaCaptura: z.enum(["alta", "media", "baixa"]).nullish(),
});

export async function entryRoutes(app: FastifyInstance) {
  // Lista os lançamentos do usuário (mais recentes primeiro) + um resumo com
  // totais e a divisão entre baldes (US-004) — tudo que o Dashboard precisa.
  app.get("/entries", async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;
    try {
      const [entries, config, despesasAgg] = await Promise.all([
        prisma.entry.findMany({
          where: { userId },
          orderBy: { data: "desc" },
        }),
        getBucketConfig(userId),
        prisma.despesaFixa.aggregate({ where: { userId }, _sum: { valor: true } }),
      ]);

      const resumo = calcularResumo(entries, config, despesasAgg._sum.valor ?? 0);

      return reply.send({ entries, resumo, config });
    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({
        erro: "Não foi possível carregar os lançamentos.",
        detalhe: err instanceof Error ? err.message : String(err),
      });
    }
  });

  app.post("/entries", async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const parsed = bodySchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        erro: "Lançamento inválido. Revise os campos.",
        detalhes: parsed.error.flatten().fieldErrors,
      });
    }

    const body = parsed.data;

    try {
      const entry = await prisma.entry.create({
        data: {
          userId,
          valor: body.valor,
          data: new Date(body.data),
          tipo: TIPO_MAP[body.tipo],
          categoria: body.categoria ?? null,
          descricao: body.descricao ?? null,
          balde: BALDE_MAP[body.balde],
          origem: ORIGEM_MAP[body.origem],
          imagemUrl: body.imagemUrl ?? null,
          confiancaCaptura: body.confiancaCaptura ?? null,
          // Único ponto do código que marca confirmação: chegar aqui significa
          // que o usuário revisou e confirmou explicitamente na UI (3.13).
          confirmadoPeloUsuario: true,
        },
      });

      return reply.status(201).send({ entry });
    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({
        erro: "Não foi possível salvar o lançamento. Tente novamente.",
        detalhe: err instanceof Error ? err.message : String(err),
      });
    }
  });

  // Override da divisão de UM lançamento (só faz sentido para receita). Os
  // quatro percentuais passam a valer para esse lançamento no motor de baldes.
  const splitSchema = z.object({
    salario: z.number().min(0).max(1),
    imposto: z.number().min(0).max(1),
    reserva: z.number().min(0).max(1),
    reinvestimento: z.number().min(0).max(1),
  });

  app.patch<{ Params: { id: string } }>("/entries/:id/split", async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;

    const parsed = splitSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        erro: "Divisão inválida (cada percentual entre 0 e 1).",
        detalhes: parsed.error.flatten().fieldErrors,
      });
    }
    const s = parsed.data;

    // updateMany escopado por userId — não atualiza lançamento de outro usuário.
    const { count } = await prisma.entry.updateMany({
      where: { id: request.params.id, userId },
      data: {
        splitSalario: s.salario,
        splitImposto: s.imposto,
        splitReserva: s.reserva,
        splitReinvestimento: s.reinvestimento,
      },
    });
    if (count === 0) return reply.status(404).send({ erro: "Lançamento não encontrado." });
    return reply.status(204).send();
  });
}
