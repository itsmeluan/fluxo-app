import type {
  CaptureExtractResponse,
  CreateEntryPayload,
  EntryRecord,
  ListEntriesResponse,
  OrigemCaptura,
} from "../types/entry";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

/**
 * Envia uma imagem para o motor de captura do backend e devolve o rascunho
 * extraído. Nunca salva nada por conta própria — quem decide persistir é a
 * tela de Captura, depois que o usuário confirma/edita (ver princípio de
 * confiança, golden source seção 3.13).
 */
export async function extractCapture(params: {
  uri: string;
  mimeType?: string;
  origem: OrigemCaptura;
}): Promise<CaptureExtractResponse> {
  const formData = new FormData();

  // React Native aceita esse formato de objeto para arquivos em FormData.
  formData.append("imagem", {
    uri: params.uri,
    name: "captura.jpg",
    type: params.mimeType ?? "image/jpeg",
  } as unknown as Blob);
  formData.append("origem", params.origem);

  const response = await fetch(`${API_URL}/capture/extract`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Falha ao extrair captura (${response.status}): ${body}`);
  }

  return response.json();
}

/**
 * Persiste um lançamento que o usuário revisou e confirmou na tela de Captura.
 * É a única chamada que de fato grava no banco — o motor de captura nunca grava
 * (princípio de confiança, golden source 3.13).
 */
export async function createEntry(payload: CreateEntryPayload): Promise<EntryRecord> {
  const response = await fetch(`${API_URL}/entries`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Falha ao salvar lançamento (${response.status}): ${body}`);
  }

  const data = (await response.json()) as { entry: EntryRecord };
  return data.entry;
}

/** Lista os lançamentos do usuário + resumo (totais e divisão entre baldes). */
export async function listEntries(): Promise<ListEntriesResponse> {
  const response = await fetch(`${API_URL}/entries`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Falha ao carregar lançamentos (${response.status}): ${body}`);
  }

  return response.json();
}
