/**
 * Tipos do motor de captura — ver golden source FLUXO-product-doc.md, seção 3.13.
 *
 * Princípio de confiança (não negociável, seção 3.13): o motor NUNCA cria um
 * lançamento direto no banco. Ele só devolve um RASCUNHO (CaptureDraft) para o
 * usuário revisar e confirmar/editar no app antes de qualquer persistência.
 */

export type TipoLancamento = "receita" | "despesa";

export type BaldeSugerido =
  | "salario" // parte que o usuário pode se pagar
  | "imposto" // reserva de imposto (MEI ou Simples/carnê-leão)
  | "reserva" // reserva de emergência / runway
  | "reinvestimento" // reinvestir no negócio
  | "indefinido"; // o modelo não conseguiu sugerir com confiança

export type OrigemCaptura = "camera" | "galeria" | "import";

/**
 * O que o modelo de visão deve extrair de uma única imagem (recibo, print de
 * PIX, ou anotação manuscrita). Todo campo é opcional na extração porque a
 * imagem pode estar ilegível ou incompleta — cabe à UI deixar claro o que
 * faltou para o usuário completar manualmente (ver "Casos de borda", 3.13).
 */
export interface CaptureExtraction {
  valor: number | null;
  data: string | null; // ISO 8601 (YYYY-MM-DD), null se não identificado
  tipo: TipoLancamento | null;
  categoria: string | null; // ex.: "alimentação", "transporte", "pagamento de cliente"
  descricao: string | null; // texto livre, ex. "PIX recebido de João Silva"
  baldeSugerido: BaldeSugerido;
  confiancaGeral: "alta" | "media" | "baixa";
  observacoes: string | null; // ex. "valor pode estar incompleto, recibo cortado"
  multiplosValoresDetectados: boolean; // true se a imagem parece ter mais de um lançamento
}

/** Corpo de resposta do endpoint POST /capture/extract. */
export interface CaptureExtractResponse {
  draft: CaptureExtraction;
  origem: OrigemCaptura;
  imagemRecebidaEm: string; // timestamp ISO de quando o backend recebeu a imagem
  avisoUsuario: string | null; // mensagem amigável quando confiança é baixa, ex. pedir nova foto
}
