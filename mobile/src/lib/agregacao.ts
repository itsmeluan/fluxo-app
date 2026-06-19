/**
 * Agregações mensais derivadas da lista de lançamentos (client-side). Mantido
 * separado das telas para reaproveitar entre Histórico e Contracheque. Se o
 * volume de lançamentos crescer, mover para um endpoint agregado no backend
 * (ver FLUXO-mockup-spec §4.2) — hoje a lista é pequena e isso é suficiente.
 */

import type { EntryRecord } from "../types/entry";

const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export interface MesAgregado {
  ano: number;
  mes: number; // 0..11
  label: string; // ex. "jun"
  receitas: number; // soma das receitas do mês
}

function ehReceita(e: EntryRecord): boolean {
  return e.tipo === "RECEITA";
}

function receitasDoMes(entries: EntryRecord[], ano: number, mes: number): number {
  return entries.reduce((soma, e) => {
    if (!ehReceita(e)) return soma;
    const d = new Date(e.data);
    return d.getFullYear() === ano && d.getMonth() === mes ? soma + e.valor : soma;
  }, 0);
}

/** Os últimos `n` meses (incluindo o atual), do mais antigo ao mais recente. */
export function ultimosMeses(entries: EntryRecord[], n = 12): MesAgregado[] {
  const hoje = new Date();
  const meses: MesAgregado[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const ano = d.getFullYear();
    const mes = d.getMonth();
    meses.push({ ano, mes, label: MESES_CURTOS[mes], receitas: receitasDoMes(entries, ano, mes) });
  }
  return meses;
}

export interface ResumoMes {
  ano: number;
  mes: number;
  salarioRecebido: number; // soma das receitas
  numEntradas: number;
  maiorCliente: { descricao: string; total: number } | null;
}

/** Resumo de um mês específico (Contracheque). */
export function resumoDoMes(entries: EntryRecord[], ano: number, mes: number): ResumoMes {
  const doMes = entries.filter((e) => {
    const d = new Date(e.data);
    return ehReceita(e) && d.getFullYear() === ano && d.getMonth() === mes;
  });

  const salarioRecebido = doMes.reduce((s, e) => s + e.valor, 0);

  const porCliente = new Map<string, number>();
  for (const e of doMes) {
    const chave = e.descricao || e.categoria || "Sem descrição";
    porCliente.set(chave, (porCliente.get(chave) ?? 0) + e.valor);
  }
  let maiorCliente: ResumoMes["maiorCliente"] = null;
  for (const [descricao, total] of porCliente) {
    if (!maiorCliente || total > maiorCliente.total) maiorCliente = { descricao, total };
  }

  return { ano, mes, salarioRecebido, numEntradas: doMes.length, maiorCliente };
}

/** Mês fechado anterior ao atual. */
export function mesFechadoAnterior(): { ano: number; mes: number } {
  const d = new Date();
  const anterior = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  return { ano: anterior.getFullYear(), mes: anterior.getMonth() };
}

export const MESES_LONGOS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
