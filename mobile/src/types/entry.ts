/**
 * Tipos espelhando backend/src/types/capture.ts — mantidos separados (não
 * compartilhando um pacote comum ainda) porque mobile e backend são deployados
 * independentemente neste estágio de protótipo. Se isso causar dessincronia
 * real no futuro, considerar um pacote npm compartilhado (ex. monorepo com
 * workspaces) — não vale a complexidade agora.
 */

export type TipoLancamento = "receita" | "despesa";

export type BaldeSugerido =
  | "salario"
  | "imposto"
  | "reserva"
  | "reinvestimento"
  | "indefinido";

export type OrigemCaptura = "camera" | "galeria" | "import";

export interface CaptureExtraction {
  valor: number | null;
  data: string | null;
  tipo: TipoLancamento | null;
  categoria: string | null;
  descricao: string | null;
  baldeSugerido: BaldeSugerido;
  confiancaGeral: "alta" | "media" | "baixa";
  observacoes: string | null;
  multiplosValoresDetectados: boolean;
}

export interface CaptureExtractResponse {
  draft: CaptureExtraction;
  origem: OrigemCaptura;
  imagemRecebidaEm: string;
  avisoUsuario: string | null;
}

/** Rascunho editável na tela de Captura — começa igual ao draft do backend,
 * mas vive só no estado local até o usuário confirmar (ainda não há POST /entries). */
export interface EditableDraft {
  valor: string; // string no formulário para facilitar edição; converter ao confirmar
  data: string;
  tipo: TipoLancamento | "";
  categoria: string;
  descricao: string;
  baldeSugerido: BaldeSugerido;
}

export function extractionToEditableDraft(extraction: CaptureExtraction): EditableDraft {
  return {
    valor: extraction.valor !== null ? String(extraction.valor) : "",
    data: extraction.data ?? "",
    tipo: extraction.tipo ?? "",
    categoria: extraction.categoria ?? "",
    descricao: extraction.descricao ?? "",
    baldeSugerido: extraction.baldeSugerido,
  };
}
