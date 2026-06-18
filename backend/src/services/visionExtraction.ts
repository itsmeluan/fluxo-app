/**
 * Serviço de extração via visão computacional — coração do motor de captura.
 * Ver golden source FLUXO-product-doc.md, seção 3.13 ("Como funciona — visão técnica").
 *
 * Decisão de arquitetura: uma única chamada multimodal (Claude vision) faz OCR +
 * classificação ao mesmo tempo, em vez de um pipeline OCR -> NLP separado. Motivo:
 * menos peças móveis, e modelos de visão atuais já lidam bem com letra manuscrita
 * em português, o que um OCR tradicional (Tesseract etc.) não faz de forma confiável.
 *
 * Alternativas mais baratas em alto volume (anotadas para revisão futura, não para
 * decidir agora): Google Cloud Vision ou AWS Textract para o OCR puro, com um passo
 * de classificação separado mais leve. Reavaliar se o custo por captura via Claude
 * se tornar um problema real em produção.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { CaptureExtraction } from "../types/capture";

const MODEL = "claude-sonnet-4-6";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY não configurada. Copie backend/.env.example para backend/.env e preencha sua chave."
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

const EXTRACTION_PROMPT = `Você é o motor de captura do FLUXO, um app financeiro para freelancers e autônomos brasileiros.

Você vai receber a foto ou imagem de UM dos seguintes tipos de documento:
- Um recibo ou nota de compra/venda
- Um comprovante/print de transferência PIX (recebida ou enviada)
- Uma anotação manuscrita sobre um pagamento, despesa, ou recebimento

Sua tarefa é extrair as informações financeiras dessa imagem e devolver SOMENTE um JSON
válido (sem texto antes ou depois, sem markdown) no seguinte formato exato:

{
  "valor": <número em reais, ex. 150.00, ou null se não identificado>,
  "data": "<YYYY-MM-DD ou null>",
  "tipo": "<receita | despesa | null>",
  "categoria": "<categoria curta em português, ex. 'pagamento de cliente', 'alimentação', 'transporte', 'material de trabalho', ou null>",
  "descricao": "<descrição curta e natural do que parece ser, ex. 'PIX recebido de cliente' ou null>",
  "baldeSugerido": "<salario | imposto | reserva | reinvestimento | indefinido>",
  "confiancaGeral": "<alta | media | baixa>",
  "observacoes": "<qualquer ressalva relevante, ou null>",
  "multiplosValoresDetectados": <true | false>
}

Regras importantes:
- Se a imagem estiver ilegível, incompleta, ou ambígua, NÃO invente valores. Use null e
  diminua "confiancaGeral", explicando em "observacoes".
- "baldeSugerido" é só uma SUGESTÃO inicial e nunca deve ser tratado como decisão final:
  - Recebimentos (receita) geralmente sugerem "salario" como ponto de partida, salvo
    indícios de que parte deve ir para imposto/reserva.
  - Despesas claramente ligadas ao negócio podem sugerir "reinvestimento".
  - Se não for possível inferir com confiança razoável, use "indefinido".
- Se a imagem parecer conter MAIS DE UM lançamento (ex. um extrato com várias linhas),
  marque "multiplosValoresDetectados": true e extraia apenas o primeiro/principal valor,
  explicando em "observacoes" que o usuário deve confirmar item por item.
- Nunca, em nenhuma circunstância, retorne texto fora do JSON.`;

/**
 * Recebe uma imagem (base64) e devolve o rascunho extraído.
 * Esta função NUNCA persiste nada — apenas retorna o rascunho para confirmação do usuário,
 * conforme o princípio de confiança da seção 3.13 do golden source.
 */
export async function extractFromImage(params: {
  base64Image: string;
  mediaType: "image/jpeg" | "image/png" | "image/webp";
}): Promise<CaptureExtraction> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: params.mediaType,
              data: params.base64Image,
            },
          },
          {
            type: "text",
            text: EXTRACTION_PROMPT,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Resposta do modelo de visão não contém texto.");
  }

  let parsed: CaptureExtraction;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    throw new Error(
      `Falha ao parsear JSON do modelo de visão. Resposta recebida: ${textBlock.text.slice(0, 300)}`
    );
  }

  return parsed;
}
