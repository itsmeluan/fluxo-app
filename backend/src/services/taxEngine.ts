/**
 * Motor de cálculo de imposto (decisão D5: MEI, Simples Nacional e carnê-leão).
 * Ver golden source 3.5 e 5.2.
 *
 * IMPORTANTE — estimativas, não verdade fiscal. As estruturas do Simples (Anexos
 * III e V) e a composição do DAS-MEI seguem a LC 123/2006 (estáveis por anos).
 * Já os valores que mudam por ano-base estão isolados em constantes marcadas com
 * TODO (salário mínimo do MEI; tabela mensal do carnê-leão). Confirmar esses
 * valores com fonte oficial do ano vigente antes de qualquer uso real.
 */

export type RegimeTributario = "mei" | "simples" | "carne_leao";

/** Atividade do MEI define os tributos fixos que entram no DAS. */
export type AtividadeMei = "comercio_industria" | "servicos" | "comercio_e_servicos";

/** Anexo do Simples — III (maioria dos serviços) ou V (serviços intelectuais). */
export type AnexoSimples = "III" | "V";

export interface CalculoImpostoInput {
  regime: RegimeTributario;
  receitaBrutaMes: number;
  /** Receita bruta acumulada dos últimos 12 meses (RBT12) — usada no Simples. */
  receitaBrutaAcumulada12m?: number;
  atividadeMei?: AtividadeMei; // default: "servicos"
  anexoSimples?: AnexoSimples; // default: "III"
}

export interface CalculoImpostoResult {
  regime: RegimeTributario;
  valorReservarImposto: number;
  aliquotaEfetiva: number; // 0 a 1
  detalhe: string;
}

// ---------------------------------------------------------------------------
// MEI — DAS = INSS (5% do salário mínimo) + ICMS (R$1, comércio/indústria) e/ou
// ISS (R$5, serviços). A composição é estável; só o salário mínimo muda por ano.
// ---------------------------------------------------------------------------
const SALARIO_MINIMO_REFERENCIA = 1518; // TODO: confirmar salário mínimo vigente (valor de 2025)
const INSS_MEI = Math.round(SALARIO_MINIMO_REFERENCIA * 0.05 * 100) / 100;
const ICMS_MEI = 1;
const ISS_MEI = 5;

function dasMei(atividade: AtividadeMei): number {
  const adicional =
    atividade === "comercio_industria"
      ? ICMS_MEI
      : atividade === "servicos"
        ? ISS_MEI
        : ICMS_MEI + ISS_MEI;
  return round2(INSS_MEI + adicional);
}

// ---------------------------------------------------------------------------
// Simples Nacional — alíquota efetiva = (RBT12 × alíquota nominal − PD) / RBT12.
// Tabelas dos Anexos III e V (LC 123/2006). Faixas por RBT12.
// ---------------------------------------------------------------------------
interface FaixaSimples {
  ate: number;
  aliquotaNominal: number;
  parcelaDeduzir: number;
}

const ANEXO_III: FaixaSimples[] = [
  { ate: 180_000, aliquotaNominal: 0.06, parcelaDeduzir: 0 },
  { ate: 360_000, aliquotaNominal: 0.112, parcelaDeduzir: 9_360 },
  { ate: 720_000, aliquotaNominal: 0.135, parcelaDeduzir: 17_640 },
  { ate: 1_800_000, aliquotaNominal: 0.16, parcelaDeduzir: 35_640 },
  { ate: 3_600_000, aliquotaNominal: 0.21, parcelaDeduzir: 125_640 },
  { ate: 4_800_000, aliquotaNominal: 0.33, parcelaDeduzir: 648_000 },
];

const ANEXO_V: FaixaSimples[] = [
  { ate: 180_000, aliquotaNominal: 0.155, parcelaDeduzir: 0 },
  { ate: 360_000, aliquotaNominal: 0.18, parcelaDeduzir: 4_500 },
  { ate: 720_000, aliquotaNominal: 0.195, parcelaDeduzir: 9_900 },
  { ate: 1_800_000, aliquotaNominal: 0.205, parcelaDeduzir: 17_100 },
  { ate: 3_600_000, aliquotaNominal: 0.23, parcelaDeduzir: 62_100 },
  { ate: 4_800_000, aliquotaNominal: 0.305, parcelaDeduzir: 540_000 },
];

function aliquotaEfetivaSimples(rbt12: number, anexo: AnexoSimples): number {
  const tabela = anexo === "V" ? ANEXO_V : ANEXO_III;
  // RBT12 muito baixo (negócio novo): usa a alíquota nominal da 1ª faixa.
  if (rbt12 <= 0) return tabela[0].aliquotaNominal;
  const faixa = tabela.find((f) => rbt12 <= f.ate) ?? tabela[tabela.length - 1];
  const efetiva = (rbt12 * faixa.aliquotaNominal - faixa.parcelaDeduzir) / rbt12;
  return Math.max(0, efetiva);
}

// ---------------------------------------------------------------------------
// Carnê-leão — tabela progressiva mensal do IRPF. TODO: confirmar faixas/deduções
// vigentes; os valores abaixo são a referência consolidada de 2024 e podem ter
// mudado (ex. desconto simplificado mensal). Não tratar como definitivo.
// ---------------------------------------------------------------------------
const TABELA_CARNE_LEAO = [
  { ate: 2259.2, aliquota: 0, deducao: 0 },
  { ate: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { ate: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { ate: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { ate: Infinity, aliquota: 0.275, deducao: 896.0 },
];

export function calcularImposto(input: CalculoImpostoInput): CalculoImpostoResult {
  switch (input.regime) {
    case "mei": {
      const atividade = input.atividadeMei ?? "servicos";
      const valor = dasMei(atividade);
      return {
        regime: "mei",
        valorReservarImposto: valor,
        aliquotaEfetiva: input.receitaBrutaMes > 0 ? valor / input.receitaBrutaMes : 0,
        detalhe:
          `MEI paga um valor fixo mensal (DAS): INSS de 5% do salário mínimo ` +
          `(${formatBRL(INSS_MEI)}) + tributo fixo conforme a atividade. ` +
          `Salário mínimo de referência ${formatBRL(SALARIO_MINIMO_REFERENCIA)} — confirmar o vigente.`,
      };
    }

    case "carne_leao": {
      const faixa = TABELA_CARNE_LEAO.find((f) => input.receitaBrutaMes <= f.ate)!;
      const imposto = Math.max(0, input.receitaBrutaMes * faixa.aliquota - faixa.deducao);
      return {
        regime: "carne_leao",
        valorReservarImposto: round2(imposto),
        aliquotaEfetiva: input.receitaBrutaMes > 0 ? imposto / input.receitaBrutaMes : 0,
        detalhe:
          "Tabela progressiva mensal (carnê-leão), referência de 2024 — faixas e " +
          "deduções podem ter mudado no ano vigente; confirmar antes de uso real.",
      };
    }

    case "simples": {
      const rbt12 = input.receitaBrutaAcumulada12m ?? input.receitaBrutaMes * 12;
      const anexo = input.anexoSimples ?? "III";
      const aliquota = aliquotaEfetivaSimples(rbt12, anexo);
      return {
        regime: "simples",
        valorReservarImposto: round2(input.receitaBrutaMes * aliquota),
        aliquotaEfetiva: aliquota,
        detalhe:
          `Simples Nacional, Anexo ${anexo}: alíquota efetiva pela RBT12 ` +
          `(${formatBRL(rbt12)}) via fórmula da LC 123/2006. O anexo correto depende ` +
          `da atividade — usando ${anexo} por padrão; confirme o seu.`,
      };
    }
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
