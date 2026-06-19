import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { captureRoutes } from "./routes/capture";
import { entryRoutes } from "./routes/entries";
import { profileRoutes } from "./routes/profile";
import { despesasFixasRoutes } from "./routes/despesasFixas";
import { impostoRoutes } from "./routes/imposto";

const app = Fastify({ logger: true });

async function main() {
  await app.register(cors, { origin: true });
  await app.register(multipart, {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB — suficiente para foto de recibo
  });

  app.get("/health", async () => ({ ok: true, servico: "fluxo-backend" }));

  await app.register(captureRoutes);
  await app.register(entryRoutes);
  await app.register(profileRoutes);
  await app.register(despesasFixasRoutes);
  await app.register(impostoRoutes);

  const port = Number(process.env.PORT) || 3000;
  await app.listen({ port, host: "0.0.0.0" });
  app.log.info(`FLUXO backend rodando em http://localhost:${port}`);
}

main().catch((err) => {
  app.log.error(err);
  process.exit(1);
});
