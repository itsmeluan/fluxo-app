import type {
  AlertaImposto,
  BucketConfig,
  CaptureExtractResponse,
  CreateEntryPayload,
  DespesaFixa,
  EntryRecord,
  ListDespesasResponse,
  ListEntriesResponse,
  OrigemCaptura,
  Perfil,
  UpdatePerfilPayload,
} from "../types/entry";

import { supabase } from "../lib/supabase";

async function jsonOuErro<T>(response: Response, contexto: string): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${contexto} (${response.status}): ${body}`);
  }
  return response.json();
}

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

/**
 * Monta os headers de uma requisição já com o Bearer token da sessão do
 * Supabase Auth. Toda chamada ao backend passa por aqui — o backend exige o
 * token (ver backend/src/lib/auth.ts).
 */
async function authHeaders(extra: Record<string, string> = {}): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const headers: Record<string, string> = { Accept: "application/json", ...extra };
  if (data.session?.access_token) {
    headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  return headers;
}

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
    headers: await authHeaders(), // sem Content-Type: o fetch define o boundary do multipart
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
    headers: await authHeaders({ "Content-Type": "application/json" }),
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
    headers: await authHeaders(),
  });

  return jsonOuErro<ListEntriesResponse>(response, "Falha ao carregar lançamentos");
}

/** Perfil do usuário (regime, meta de salário, tipo de trabalho). */
export async function getMe(): Promise<Perfil> {
  const response = await fetch(`${API_URL}/me`, {
    headers: await authHeaders(),
  });
  return jsonOuErro<Perfil>(response, "Falha ao carregar perfil");
}

export async function updateMe(payload: UpdatePerfilPayload): Promise<Perfil> {
  const response = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: await authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  return jsonOuErro<Perfil>(response, "Falha ao salvar perfil");
}

export async function getBucketConfig(): Promise<BucketConfig> {
  const response = await fetch(`${API_URL}/bucket-config`, {
    headers: await authHeaders(),
  });
  return jsonOuErro<BucketConfig>(response, "Falha ao carregar baldes");
}

export async function updateBucketConfig(config: BucketConfig): Promise<BucketConfig> {
  const response = await fetch(`${API_URL}/bucket-config`, {
    method: "PUT",
    headers: await authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(config),
  });
  return jsonOuErro<BucketConfig>(response, "Falha ao salvar baldes");
}

export async function listDespesasFixas(): Promise<ListDespesasResponse> {
  const response = await fetch(`${API_URL}/despesas-fixas`, {
    headers: await authHeaders(),
  });
  return jsonOuErro<ListDespesasResponse>(response, "Falha ao carregar despesas fixas");
}

export async function createDespesaFixa(descricao: string, valor: number): Promise<DespesaFixa> {
  const response = await fetch(`${API_URL}/despesas-fixas`, {
    method: "POST",
    headers: await authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ descricao, valor }),
  });
  const data = await jsonOuErro<{ despesa: DespesaFixa }>(response, "Falha ao adicionar despesa");
  return data.despesa;
}

export async function deleteDespesaFixa(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/despesas-fixas/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Falha ao remover despesa (${response.status}): ${body}`);
  }
}

/** Estimativa de imposto vs. saldo do balde (não-autoritativa — ver taxEngine). */
export async function getAlertaImposto(): Promise<AlertaImposto> {
  const response = await fetch(`${API_URL}/alerta-imposto`, {
    headers: await authHeaders(),
  });
  return jsonOuErro<AlertaImposto>(response, "Falha ao carregar alerta de imposto");
}
