/**
 * Despesas fixas mensais (mockup §3.9 / golden source 3.5/5.2). Insumo do
 * cálculo de fôlego no Dashboard. Sem auth ainda: opera sobre o dev user.
 */

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getDevUserId } from "../lib/devUser";

const criarSchema = z.object({
  descricao: z.string().trim().min(1, "descrição obrigatória"),
  valor: z.number().positive("valor deve ser maior que zero"),
});

export async function despesasFixasRoutes(app: FastifyInstance) {
  app.get("/despesas-fixas", async (_request, reply) => {
    const userId = await getDevUserId();
    const despesas = await prisma.despesaFixa.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    const totalMensal = despesas.reduce((soma, d) => soma + d.valor, 0);
    return reply.send({ despesas, totalMensal: Math.round(totalMensal * 100) / 100 });
  });

  app.post("/despesas-fixas", async (request, reply) => {
    const parsed = criarSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        erro: "Despesa inválida.",
        detalhes: parsed.error.flatten().fieldErrors,
      });
    }
    const userId = await getDevUserId();
    const despesa = await prisma.despesaFixa.create({
      data: { userId, descricao: parsed.data.descricao, valor: parsed.data.valor },
    });
    return reply.status(201).send({ despesa });
  });

  app.delete<{ Params: { id: string } }>("/despesas-fixas/:id", async (request, reply) => {
    const userId = await getDevUserId();
    // deleteMany (não delete) para escopar por userId — evita apagar despesa de
    // outro usuário por id adivinhado quando a auth existir.
    const { count } = await prisma.despesaFixa.deleteMany({
      where: { id: request.params.id, userId },
    });
    if (count === 0) {
      return reply.status(404).send({ erro: "Despesa não encontrada." });
    }
    return reply.status(204).send();
  });
}
