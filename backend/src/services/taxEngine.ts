/**
 * Motor de cálculo de imposto — STUB inicial (decisão D5: suportar MEI e
 * Simples Nacional/carnê-leão). Ver golden source, seções 3.5 e 5.2.
 *
 * IMPORTANTE: os valores abaixo são SIMPLIFICADOS para destravar o protótipo do
 * motor de captura. Antes de qualquer uso real com dinheiro de usuários, isso
 * precisa de revisão com uma fonte tributária atualizada (tabelas mudam por ano-base
 * e por categoria de MEI). Não tratar os números aqui como verdade fiscal.
 */

export type RegimeTributario = "mei" | "simples" | "carne_leao";

export interface CalculoImpostoInput {
  regime: RegimeTributario;
  receitaBrutaMes: number;
  /** Só relevante para "simples": receita bruta acumulada nos últimos 12 meses (RBT12). */
  receitaBrutaAcumulada12m?: number;
}

export interface CalculoImpostoResult {
  regime: RegimeTributario;
  valorReservarImposto: number;
  aliquotaEfetiva: number; // 0 a 1
  detalhe: string;
}

/**
 * MEI: valor fixo mensal (DAS-MEI), independente da receita do mês — por isso a
 * "reserva de imposto" do MEI é menos sobre alíquota e mais sobre garantir caixa
 * para a guia fixa. Valor de referência 2026 a confirmar (TODO).
 */
const DAS_MEI_VALOR_FIXO_REFERENCIA = 76.9; // TODO: confirmar valor vigente do ano-base

/**
 * Carnê-leão: tabela progressiva mensal do IRPF (TODO: confirmar faixas vigentes).
 * Estrutura aqui é só ilustrativa para o protótipo do motor de captura.
 */
const TABELA_CARNE_LEAO = [
  { ate: 2259.2, aliquota: 0, deducao: 0 },
  { ate: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { ate: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { ate: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { ate: Infinity, aliquota: 0.275, deducao: 896.0 },
];

/**
 * Simples Nacional: alíquota efetiva por faixa de RBT12 (Anexo III/V simplificado).
 * TODO: diferenciar por anexo real da atividade do usuário — hoje usa uma curva
 * única só para o protótipo não travar em "não sei calcular".
 */
const TABELA_SIMPLES_RBT12 = [
  { ate: 180_000, aliquota: 0.06 },
  { ate: 360_000, aliquota: 0.112 },
  { ate: 720_000, aliquota: 0.135 },
  { ate: 1_800_000, aliquota: 0.16 },
  { ate: Infinity, aliquota: 0.21 },
];

export function calcularImposto(input: CalculoImpostoInput): CalculoImpostoResult {
  switch (input.regime) {
    case "mei":
      return {
        regime: "mei",
        valorReservarImposto: DAS_MEI_VALOR_FIXO_REFERENCIA,
        aliquotaEfetiva:
          input.receitaBrutaMes > 0
            ? DAS_MEI_VALOR_FIXO_REFERENCIA / input.receitaBrutaMes
            : 0,
        detalhe:
          "MEI paga um valor fixo mensal (DAS-MEI), não uma alíquota sobre a receita. " +
          "Valor de referência usado no protótipo — confirmar valor vigente antes de produção.",
      };

    case "carne_leao": {
      const faixa = TABELA_CARNE_LEAO.find((f) => input.receitaBrutaMes <= f.ate)!;
      const imposto = Math.max(
        0,
        input.receitaBrutaMes * faixa.aliquota - faixa.deducao
      );
      return {
        regime: "carne_leao",
        valorReservarImposto: round2(imposto),
        aliquotaEfetiva: input.receitaBrutaMes > 0 ? imposto / input.receitaBrutaMes : 0,
        detalhe:
          "Tabela progressiva mensal (carnê-leão) — faixas e deduções de referência, " +
          "a confirmar com tabela vigente do ano-base antes de uso real.",
      };
    }

    case "simples": {
      const rbt12 = input.receitaBrutaAcumulada12m ?? input.receitaBrutaMes * 12;
      const faixa = TABELA_SIMPLES_RBT12.find((f) => rbt12 <= f.ate)!;
      const imposto = input.receitaBrutaMes * faixa.aliquota;
      return {
        regime: "simples",
        valorReservarImposto: round2(imposto),
        aliquotaEfetiva: faixa.aliquota,
        detalhe:
          "Alíquota efetiva estimada pela faixa de receita bruta acumulada em 12 meses " +
          "(RBT12), sem diferenciar anexo de atividade — simplificação do protótipo.",
      };
    }
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
