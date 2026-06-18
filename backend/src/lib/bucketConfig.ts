/**
 * Carrega a configuração de baldes do usuário, criando-a com os percentuais
 * padrão (definidos no schema.prisma) se ainda não existir. Ver golden source 3.5.
 *
 * Os defaults do schema (50/15/25/10) são placeholders de protótipo — quando o
 * onboarding (Épico 1) coletar os percentuais reais do usuário, é aqui/no
 * onboarding que eles passam a ser gravados.
 */

import { prisma } from "./prisma";
import type { BaldePercentuais } from "../services/bucketEngine";

export async function getBucketConfig(userId: string): Promise<BaldePercentuais> {
  const config = await prisma.bucketConfig.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: {
      percentSalario: true,
      percentImposto: true,
      percentReserva: true,
      percentReinvestimento: true,
    },
  });

  return config;
}
