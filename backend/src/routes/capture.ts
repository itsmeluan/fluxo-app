/**
 * Rota do motor de captura. Ver golden source, seção 3.13.
 *
 * POST /capture/extract
 *   multipart/form-data com campo "imagem" (arquivo) e campo opcional "origem"
 *   ("camera" | "galeria" | "import").
 *
 * Resposta: sempre um RASCUNHO (CaptureExtractResponse) — nunca cria nada no banco.
 * A confirmação/edição e o salvamento de fato acontecem em outra chamada
 * (POST /entries — ver routes/entries.ts).
 */

import type { FastifyInstance } from "fastify";
import { extractFromImage } from "../services/visionExtraction";
import { requireUser } from "../lib/auth";
import type { CaptureExtractResponse, OrigemCaptura } from "../types/capture";

const MEDIA_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function captureRoutes(app: FastifyInstance) {
  app.post("/capture/extract", async (request, reply) => {
    // Exige autenticação antes de chamar a API de visão (que tem custo).
    if (!(await requireUser(request, reply))) return;

    // @fastify/multipart v10 lança FST_INVALID_MULTIPART_CONTENT_TYPE quando a
    // requisição não é multipart (em vez de retornar undefined como na v8).
    // Capturamos para devolver o mesmo 400 amigável em vez de um 406 cru.
    let data;
    try {
      data = await request.file();
    } catch (err) {
      if (err && typeof err === "object" && "code" in err && err.code === "FST_INVALID_MULTIPART_CONTENT_TYPE") {
        return reply.status(400).send({
          erro: "Nenhuma imagem enviada. Envie multipart/form-data com o campo 'imagem'.",
        });
      }
      throw err;
    }

    if (!data) {
      return reply.status(400).send({
        erro: "Nenhuma imagem enviada. Envie multipart/form-data com o campo 'imagem'.",
      });
    }

    if (!MEDIA_TYPES.has(data.mimetype)) {
      return reply.status(400).send({
        erro: `Tipo de imagem não suportado: ${data.mimetype}. Use JPEG, PNG ou WebP.`,
      });
    }

    const origemCampo = (data.fields?.origem as { value?: string } | undefined)?.value;
    const origem: OrigemCaptura =
      origemCampo === "camera" || origemCampo === "galeria" || origemCampo === "import"
        ? origemCampo
        : "import";

    const buffer = await data.toBuffer();
    const base64Image = buffer.toString("base64");

    try {
      const draft = await extractFromImage({
        base64Image,
        mediaType: data.mimetype as "image/jpeg" | "image/png" | "image/webp",
      });

      const avisoUsuario =
        draft.confiancaGeral === "baixa"
          ? "Não conseguimos ler essa imagem com confiança. Revise os campos abaixo com atenção, ou tire uma nova foto com mais luz e foco."
          : draft.multiplosValoresDetectados
            ? "Essa imagem parece ter mais de um lançamento. Confirmamos só o principal — revise se precisa cadastrar os outros separadamente."
            : null;

      const response: CaptureExtractResponse = {
        draft,
        origem,
        imagemRecebidaEm: new Date().toISOString(),
        avisoUsuario,
      };

      return reply.send(response);
    } catch (err) {
      app.log.error(err);
      return reply.status(502).send({
        erro:
          "Falha ao processar a imagem no motor de captura. Tente novamente em alguns segundos.",
        detalhe: err instanceof Error ? err.message : String(err),
      });
    }
  });
}
