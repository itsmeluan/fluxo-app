# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

FLUXO ("Seu salário, mesmo sem patrão") is a financial app for Brazilian freelancers/autônomos with irregular income. The golden source for all product decisions is `FLUXO-product-doc.md` — read it before making product/UX calls, especially section 3.13 (motor de captura / capture engine) and 3.5/5.2 (baldes / bucket model, tax regimes).

This repo started as a Sprint 1 prototype validating the highest-risk piece — the capture engine (camera/image → structured financial entry) — and has since grown the surrounding app: real persistence, Supabase email/password auth, onboarding, dashboard with bucket split + runway, manual entry, fixed expenses, history and contracheque. The tax engine (`taxEngine.ts`) remains a clearly-marked non-authoritative stub and is not yet wired to any route.

```
FLUXO-product-doc.md                 golden source — all product documentation
FLUXO-formulario-e-divulgacao.md     validation survey content
FLUXO-validation-survey-config.json  survey config (csv_url) for automated monitoring
FLUXO-validation-tracking.md         live log of survey responses

backend/   Fastify + TypeScript API
mobile/    Expo + React Native + TypeScript app (Android + iOS from one codebase)
```

## Commands

### Backend (`backend/`)
```
npm install
npm run dev              # tsx watch src/server.ts — dev server with hot reload, http://localhost:3000
npm run build             # tsc -p tsconfig.json -> dist/
npm start                 # node dist/server.js (run build first)
npm run prisma:generate   # regenerate Prisma client after schema.prisma changes
```
There is no test suite and no lint script configured yet.

### Mobile (`mobile/`)
```
npm install
npx expo install --fix    # always run after install — aligns native lib versions with the installed Expo SDK
npx expo start            # then open in Expo Go, or:
npx expo start --ios
npx expo start --android
```
If testing on a physical device via Expo Go, `EXPO_PUBLIC_API_URL` (in `mobile/.env`) must be the host machine's LAN IP, not `localhost`.

## Architecture

### Capture engine (the core piece — backend/src + mobile/src/screens/CaptureScreen.tsx)

The product's central technical bet: a single multimodal call (Claude vision, model `claude-sonnet-4-6`, see `backend/src/services/visionExtraction.ts`) does OCR + classification together in one pass, instead of a separate OCR→NLP pipeline. This was a deliberate choice — current vision models handle Portuguese handwriting reliably, which traditional OCR (Tesseract etc.) does not. Cheaper alternatives (Google Cloud Vision, AWS Textract) are noted as a future revisit if per-capture cost becomes a problem at volume, not a current TODO.

Flow: `mobile/src/screens/CaptureScreen.tsx` (camera or gallery image) → `mobile/src/api/client.ts` (`extractCapture`, multipart POST) → `backend/src/routes/capture.ts` (`POST /capture/extract`) → `backend/src/services/visionExtraction.ts` (Anthropic vision call with a strict JSON-only prompt) → response shape defined in `backend/src/types/capture.ts` (`CaptureExtraction` / `CaptureExtractResponse`).

**Non-negotiable trust principle (golden source 3.13):** the capture engine NEVER writes to the database. It only ever returns a draft for the user to review and edit. This is enforced at every layer — the backend route never touches Prisma, and the mobile `CaptureScreen` always shows an editable form before any "confirm" action. When extending this flow, preserve that invariant; don't let the vision call result flow directly into a persisted record anywhere.

`POST /entries` (`backend/src/routes/entries.ts`) persists a user-confirmed entry — it's the only write path to `Entry`. `CaptureScreen`'s confirm button validates the edited draft and calls it via `createEntry` (`mobile/src/api/client.ts`). The route is the *only* place in the codebase that sets `confirmadoPeloUsuario = true` (reaching it means the user confirmed in the UI — golden source 3.13). It maps the lowercase app enums (`receita`, `salario`, …) to the uppercase Prisma enums.

`GET /entries` returns the user's entries (most recent first) plus a `resumo`: totals (`totalReceitas`/`totalDespesas`/`saldo`), the per-bucket split (`baldes`), and `folego` (runway). The split is computed by `backend/src/services/bucketEngine.ts` (a pure function — golden source 3.5 / US-004): each RECEITA is divided across the four buckets by the user's `BucketConfig` percentages; each DESPESA is debited from the bucket it was tagged with (`balde`), and untagged expenses fall back to `salario` — a documented prototype simplification. `Entry` itself still stores only the single confirmed `balde`; the split is a read-time computation, never persisted. `folego.meses` = `(reserva + salario buckets) / monthly fixed expenses` (also a documented prototype formula — `calcularFolego`), `null` when no `DespesaFixa` rows exist. The mobile `DashboardScreen` consumes this and shows the Salário bucket as the headline (US-005) plus the fôlego card.

`DespesaFixa` (model + `backend/src/routes/despesasFixas.ts`: `GET`/`POST`/`DELETE /despesas-fixas[/:id]`) holds recurring monthly expenses; the mobile `DespesasFixasScreen` manages them and their total feeds the fôlego calc. DELETE uses `deleteMany` scoped by `userId` (forward-compatible with auth).

### Auth (`backend/src/lib/auth.ts` + `mobile/src/lib/supabase.ts`)

Auth is implemented (Épico 1) via **Supabase Auth, email/password**. The mobile app authenticates directly against Supabase Auth and gets an access token; **all data still flows through the Fastify backend** with `Authorization: Bearer <token>` — the backend stays the trusted intermediary (Prisma over the service connection), so RLS isn't relied on for request scoping. `requireUser(request, reply)` validates the token by calling Supabase `GET /auth/v1/user` (60s in-memory cache) and lazily upserts the app `User` with `id = auth.uid`; every route calls it and returns early on a 401. There is no more dev user — `devUser.ts` was deleted.

Supabase URL + anon/publishable key are public by design, so both `auth.ts` and `supabase.ts` carry them as in-code fallbacks (env overrides: `SUPABASE_URL`/`SUPABASE_ANON_KEY` on the backend, `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_ANON_KEY` on mobile) — so no new Railway vars are required. **Email confirmation is currently ON** in the Supabase project: signup returns no session until the email is confirmed; `LoginScreen` handles this (shows a "confirme seu e-mail" notice). Toggle it off in the Supabase dashboard (Auth → Email → Confirm email) for a frictionless prototype signup.

### Data model (`backend/prisma/schema.prisma`)

Three entities: `User`, `BucketConfig` (per-user split percentages across salario/imposto/reserva/reinvestimento buckets — golden source 3.5), `Entry` (a financial entry, either from the capture engine or manual, with `confirmadoPeloUsuario` defaulting to `false` and never auto-set — same trust principle as above).

The schema file's header comment says persistence isn't connected — that's now stale: the project is wired to a live Supabase Postgres (see Infrastructure below) and RLS is enabled on all three tables. The comment was accurate at prototype creation time but hasn't been updated since the DB was connected.

### Tax engine (`backend/src/services/taxEngine.ts`)

Stub with simplified, clearly-marked-as-non-authoritative tables for MEI / Simples Nacional / carnê-leão. Do not treat the constants in this file as correct tax figures — they're placeholders to unblock prototype work, explicitly flagged with TODOs for confirming current-year values.

### Mobile navigation (`mobile/src/navigation/index.tsx`)

`navigation/index.tsx` first gates on the Supabase Auth session: no session → `Login`; session present → the app stack, with the initial route chosen from the local "onboarding concluído" flag (`mobile/src/lib/session.ts`, AsyncStorage) — returning users land on Dashboard, new users on Onboarding. `onAuthStateChange` swaps the tree on login/logout (logout lives in `BaldesConfigScreen`). Note the onboarding flag is device-local, not per-account — a known prototype simplification. Screens (Login + Onboarding → Dashboard → Capture/NovaEntrada/EntradaConfirmacao/SalarioDetalhe/BaldesConfig/DespesasFixas/Historico/HistoricoMesDetalhe/Contracheque):
- **Onboarding** — 5-step wizard (tipo de trabalho → regime → meta de salário → divisão de baldes → primeira entrada). On finish it persists the profile (`PUT /me`) and bucket percentages (`PUT /bucket-config`), marks the session, and routes to Dashboard (or Capture). Bucket percentages use −/+ steppers (5% increments) rather than sliders — deliberate, to avoid a native slider dependency.
- **Dashboard** — fetches `GET /entries` + `GET /me` on focus (refreshes after a confirmed capture); shows the Salário headline with a status pill + progress bar against `metaSalario`, the bucket cards, period totals, and the entry list. The fôlego/runway card is an honest "em breve" placeholder (depends on DespesaFixa, which doesn't exist yet).
- **Capture** — fully implemented.

`GET/PUT /me` (`backend/src/routes/profile.ts`) read/update the user profile; `GET/PUT /bucket-config` read/update the percentages. The `User` model gained `tipoTrabalho` and `metaSalario` (both nullable) for onboarding; `regime` maps `mei`/`simples`/`carne_leao` ↔ Prisma enum, with `nao_sei`/null → null.

## Infrastructure (live, as of this prototype's deployment)

- **Database:** Supabase Postgres (project ref `yrujsgwyufgrucgyjmez`). `backend/.env`'s `DATABASE_URL` points at the Supabase transaction pooler (port 6543) and **must end with `?pgbouncer=true`** — without it Prisma reuses prepared statement names across pooled backends and throws intermittent `prepared statement "s1" already exists` (42P05) errors. This flag must be present in **both** `backend/.env` and the Railway `DATABASE_URL` service variable. Because it's the transaction pooler, DDL (schema changes) cannot go through Prisma `migrate`/`db push` — apply migrations via the Supabase MCP `apply_migration` or the dashboard SQL editor instead. RLS is enabled on `User`, `BucketConfig`, and `Entry`.
- **Backend hosting:** Railway, project `fluxo-backend`, service `fluxo-app`, connected to this GitHub repo (`itsmeluan/fluxo-app`, branch `main`) with auto-deploy on push. The service's Root Directory is set to `/backend` (required — Railway's Railpack build auto-detection scans repo root by default, and this is a monorepo).
- **Vision API:** `ANTHROPIC_API_KEY` (Anthropic Console key) is required by `visionExtraction.ts` and is configured both in `backend/.env` (local dev) and as a Railway service variable (production) — these are separate values that must each be kept in sync manually if rotated.
- **Fastify 5 stack:** the backend runs Fastify `^5.8.5` with `@fastify/multipart` `^10` and `@fastify/cors` `^11` — these majors are coupled (multipart 10 / cors 11 require Fastify 5; the older multipart 8 / cors 9 required Fastify 4). Keep them in lockstep when bumping, or the server crashes at boot with `FST_ERR_PLUGIN_VERSION_MISMATCH`. Note multipart 10's `request.file()` *throws* `FST_INVALID_MULTIPART_CONTENT_TYPE` on non-multipart requests (v8 returned `undefined`) — `routes/capture.ts` catches this to keep its friendly 400.
