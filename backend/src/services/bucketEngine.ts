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

export interface Folego {
  // meses que o usuário aguenta sem nova receita; null quando não há despesas
  // fixas cadastradas (sem denominador não dá pra calcular).
  meses: number | null;
  despesasFixasMensais: number;
}

export interface ResumoEntries {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  baldes: BaldeSaldos;
  folego: Folego;
}

interface EntryParaResumo {
  valor: number;
  tipo: TipoLancamento;
  balde: BaldeTipo | null;
  // Override de divisão por lançamento (só RECEITA). Quando os quatro estão
  // presentes, têm prioridade sobre o BucketConfig do usuário.
  splitSalario?: number | null;
  splitImposto?: number | null;
  splitReserva?: number | null;
  splitReinvestimento?: number | null;
}

/** Usa o override do lançamento se completo; senão, o config global do usuário. */
function percentuaisDoLancamento(
  entry: EntryParaResumo,
  config: BaldePercentuais
): BaldePercentuais {
  const { splitSalario, splitImposto, splitReserva, splitReinvestimento } = entry;
  if (
    splitSalario != null &&
    splitImposto != null &&
    splitReserva != null &&
    splitReinvestimento != null
  ) {
    return {
      percentSalario: splitSalario,
      percentImposto: splitImposto,
      percentReserva: splitReserva,
      percentReinvestimento: splitReinvestimento,
    };
  }
  return config;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Fôlego/runway (golden source 3.5/5.2) — quantos meses o usuário se mantém sem
 * nova receita. Simplificação de protótipo: usamos o colchão dos baldes reserva
 * + salário dividido pelo total mensal de despesas fixas. Revisar a fórmula com
 * o golden source quando o conceito for fechado (ver FLUXO-mockup-spec §4).
 */
export function calcularFolego(baldes: BaldeSaldos, despesasFixasMensais: number): Folego {
  const colchao = Math.max(0, baldes.reserva + baldes.salario);
  const meses =
    despesasFixasMensais > 0 ? Math.round((colchao / despesasFixasMensais) * 10) / 10 : null;
  return { meses, despesasFixasMensais: round2(despesasFixasMensais) };
}

export function calcularResumo(
  entries: EntryParaResumo[],
  config: BaldePercentuais,
  despesasFixasMensais = 0
): ResumoEntries {
  const baldes: BaldeSaldos = { salario: 0, imposto: 0, reserva: 0, reinvestimento: 0 };
  let totalReceitas = 0;
  let totalDespesas = 0;

  for (const entry of entries) {
    if (entry.tipo === TipoLancamento.RECEITA) {
      totalReceitas += entry.valor;
      const p = percentuaisDoLancamento(entry, config);
      baldes.salario += entry.valor * p.percentSalario;
      baldes.imposto += entry.valor * p.percentImposto;
      baldes.reserva += entry.valor * p.percentReserva;
      baldes.reinvestimento += entry.valor * p.percentReinvestimento;
    } else {
      totalDespesas += entry.valor;
      const alvo = baldeDaDespesa(entry.balde);
      baldes[alvo] -= entry.valor;
    }
  }

  const baldesArredondados: BaldeSaldos = {
    salario: round2(baldes.salario),
    imposto: round2(baldes.imposto),
    reserva: round2(baldes.reserva),
    reinvestimento: round2(baldes.reinvestimento),
  };

  return {
    totalReceitas: round2(totalReceitas),
    totalDespesas: round2(totalDespesas),
    saldo: round2(totalReceitas - totalDespesas),
    baldes: baldesArredondados,
    folego: calcularFolego(baldesArredondados, despesasFixasMensais),
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
