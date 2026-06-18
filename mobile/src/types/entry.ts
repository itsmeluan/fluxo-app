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

/** Corpo enviado ao POST /entries ao confirmar um lançamento (ver backend/src/routes/entries.ts). */
export interface CreateEntryPayload {
  valor: number;
  data: string; // "YYYY-MM-DD" ou ISO 8601
  tipo: TipoLancamento;
  categoria: string | null;
  descricao: string | null;
  balde: BaldeSugerido;
  origem: OrigemCaptura | "manual";
  imagemUrl?: string | null;
  confiancaCaptura?: "alta" | "media" | "baixa" | null;
}

/** Lançamento já persistido, como devolvido pelo POST /entries e GET /entries. */
export interface EntryRecord {
  id: string;
  valor: number;
  data: string;
  tipo: string; // "RECEITA" | "DESPESA" (enum Prisma, em maiúsculas)
  categoria: string | null;
  descricao: string | null;
  balde: string | null;
  confirmadoPeloUsuario: boolean;
}

export interface BaldeSaldos {
  salario: number;
  imposto: number;
  reserva: number;
  reinvestimento: number;
}

/** Resumo calculado pelo backend (totais + divisão entre baldes, US-004). */
export interface EntryResumo {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  baldes: BaldeSaldos;
}

/** Resposta do GET /entries — tudo que o Dashboard precisa em uma chamada. */
export interface ListEntriesResponse {
  entries: EntryRecord[];
  resumo: EntryResumo;
}

export type RegimeTributario = "mei" | "simples" | "carne_leao";

/** Perfil do usuário (GET/PUT /me). */
export interface Perfil {
  id: string;
  email: string;
  nome: string | null;
  regime: RegimeTributario | null;
  tipoTrabalho: string | null;
  metaSalario: number | null;
}

/** Percentuais de baldes (GET/PUT /bucket-config). */
export interface BucketConfig {
  percentSalario: number;
  percentImposto: number;
  percentReserva: number;
  percentReinvestimento: number;
}

/** Payload do PUT /me — todos opcionais; "nao_sei" mapeia regime para null no backend. */
export interface UpdatePerfilPayload {
  nome?: string | null;
  regime?: RegimeTributario | "nao_sei" | null;
  tipoTrabalho?: string | null;
  metaSalario?: number | null;
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
