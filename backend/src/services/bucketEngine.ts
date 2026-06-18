/**
 * Motor de baldes — cálculo da divisão de receita entre baldes (golden source
 * seções 3.5 "Configuração de baldes" e 3.6 US-004).
 *
 * Modelo (Ângulo A — "Baldes Automáticos"): cada RECEITA é dividida entre os
 * quatro baldes pelos percentuais configurados pelo usuário (BucketConfig).
 * Cada DESPESA reduz o balde em que foi classificada.
 *
 * Simplificação de protótipo (documentada de propósito): despesa sem balde
 * definido é debitada do balde "salário" (o dinheiro que o usuário se paga).
 * Quando houver categorização de despesa mais rica, revisar esta regra.
 *
 * Função pura: não toca no banco. Recebe os lançamentos e a config já carregados.
 */

import { BaldeTipo, TipoLancamento } from "@prisma/client";

export interface BaldePercentuais {
  percentSalario: number;
  percentImposto: number;
  percentReserva: number;
  percentReinvestimento: number;
}

export interface BaldeSaldos {
  salario: number;
  imposto: number;
  reserva: number;
  reinvestimento: number;
}

export interface ResumoEntries {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  baldes: BaldeSaldos;
}

interface EntryParaResumo {
  valor: number;
  tipo: TipoLancamento;
  balde: BaldeTipo | null;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calcularResumo(
  entries: EntryParaResumo[],
  config: BaldePercentuais
): ResumoEntries {
  const baldes: BaldeSaldos = { salario: 0, imposto: 0, reserva: 0, reinvestimento: 0 };
  let totalReceitas = 0;
  let totalDespesas = 0;

  for (const entry of entries) {
    if (entry.tipo === TipoLancamento.RECEITA) {
      totalReceitas += entry.valor;
      baldes.salario += entry.valor * config.percentSalario;
      baldes.imposto += entry.valor * config.percentImposto;
      baldes.reserva += entry.valor * config.percentReserva;
      baldes.reinvestimento += entry.valor * config.percentReinvestimento;
    } else {
      totalDespesas += entry.valor;
      const alvo = baldeDaDespesa(entry.balde);
      baldes[alvo] -= entry.valor;
    }
  }

  return {
    totalReceitas: round2(totalReceitas),
    totalDespesas: round2(totalDespesas),
    saldo: round2(totalReceitas - totalDespesas),
    baldes: {
      salario: round2(baldes.salario),
      imposto: round2(baldes.imposto),
      reserva: round2(baldes.reserva),
      reinvestimento: round2(baldes.reinvestimento),
    },
  };
}

function baldeDaDespesa(balde: BaldeTipo | null): keyof BaldeSaldos {
  switch (balde) {
    case BaldeTipo.IMPOSTO:
      return "imposto";
    case BaldeTipo.RESERVA:
      return "reserva";
    case BaldeTipo.REINVESTIMENTO:
      return "reinvestimento";
    case BaldeTipo.SALARIO:
    default:
      return "salario"; // inclui o caso null — ver simplificação no topo do arquivo
  }
}
