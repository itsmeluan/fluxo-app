# FLUXO — backend (protótipo)

API mínima para testar o motor de captura (golden source, seção 3.13). Fastify + TypeScript.

## Setup

```
npm install
cp .env.example .env   # preencher ANTHROPIC_API_KEY (obrigatório p/ /capture/extract)
npm run dev
```

Servidor sobe em `http://localhost:3000` (configurável via `PORT` no `.env`).

## Endpoints

### `GET /health`
Checagem simples — retorna `{ ok: true, servico: "fluxo-backend" }`.

### `POST /capture/extract`
O endpoint central deste protótipo. Recebe `multipart/form-data`:
- `imagem` (arquivo, obrigatório) — JPEG, PNG ou WebP, até 10MB.
- `origem` (texto, opcional) — `"camera" | "galeria" | "import"`. Default `"import"`.

Devolve um **rascunho** (`CaptureExtractResponse`, ver `src/types/capture.ts`) com valor,
data, tipo, categoria, balde sugerido e nível de confiança — **nunca persiste nada**. A
confirmação/edição do usuário e o salvamento definitivo são responsabilidade do app
mobile (ainda não implementado: rota `POST /entries`).

Exemplo rápido via `curl`:
```
curl -X POST http://localhost:3000/capture/extract \
  -F "imagem=@/caminho/para/recibo.jpg" \
  -F "origem=camera"
```

## O que é stub vs. o que é real

| Peça | Estado |
|---|---|
| `POST /capture/extract` | Real — chama a API de visão da Anthropic de verdade |
| `taxEngine.ts` (cálculo de imposto) | Stub com tabelas simplificadas — **não usar os valores como verdade fiscal** |
| Persistência (Prisma) | Schema declarado, sem banco conectado — `prisma migrate` ainda não foi rodado |
| Autenticação | Não existe ainda |
| `POST /entries` (salvar lançamento confirmado) | Não implementado ainda |

## Por que Fastify + Prisma + Postgres/Supabase

Ver seção 3.12 do golden source para o raciocínio completo de stack. Resumo: Fastify por
ser leve e rápido de prototipar; Prisma porque dá um schema declarativo fácil de evoluir
enquanto o modelo de dados ainda está mudando; Postgres via Supabase é a opção recomendada
para quando a persistência for ligada de fato (dá storage de imagem no mesmo provedor).
