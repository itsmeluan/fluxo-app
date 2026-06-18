import type { CaptureExtractResponse, OrigemCaptura } from "../types/entry";

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
