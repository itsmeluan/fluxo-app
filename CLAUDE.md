# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

FLUXO ("Seu salário, mesmo sem patrão") is a financial app for Brazilian freelancers/autônomos with irregular income. The golden source for all product decisions is `FLUXO-product-doc.md` — read it before making product/UX calls, especially section 3.13 (motor de captura / capture engine) and 3.5/5.2 (baldes / bucket model, tax regimes).

This repo currently holds a Sprint 1 prototype that validates the single highest-risk piece of the product: the capture engine (camera/image → structured financial entry). Most of the rest of the app (auth, real persistence wiring, real tax math, dashboard/onboarding content) is intentionally stubbed.

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

`GET /entries` returns the user's entries (most recent first) plus a `resumo`: totals (`totalReceitas`/`totalDespesas`/`saldo`) and the per-bucket split (`baldes`). The split is computed by `backend/src/services/bucketEngine.ts` (a pure function — golden source 3.5 / US-004): each RECEITA is divided across the four buckets by the user's `BucketConfig` percentages; each DESPESA is debited from the bucket it was tagged with (`balde`), and untagged expenses fall back to `salario` — a documented prototype simplification. `Entry` itself still stores only the single confirmed `balde`; the split is a read-time computation, never persisted. The mobile `DashboardScreen` consumes this and shows the Salário bucket as the headline (US-005).

One prototype shortcut to be aware of: there's no auth yet, so every entry / bucket config is attached to a single dev user upserted by `backend/src/lib/devUser.ts` (delete that file when Épico 1 / auth lands).

### Data model (`backend/prisma/schema.prisma`)

Three entities: `User`, `BucketConfig` (per-user split percentages across salario/imposto/reserva/reinvestimento buckets — golden source 3.5), `Entry` (a financial entry, either from the capture engine or manual, with `confirmadoPeloUsuario` defaulting to `false` and never auto-set — same trust principle as above).

The schema file's header comment says persistence isn't connected — that's now stale: the project is wired to a live Supabase Postgres (see Infrastructure below) and RLS is enabled on all three tables. The comment was accurate at prototype creation time but hasn't been updated since the DB was connected.

### Tax engine (`backend/src/services/taxEngine.ts`)

Stub with simplified, clearly-marked-as-non-authoritative tables for MEI / Simples Nacional / carnê-leão. Do not treat the constants in this file as correct tax figures — they're placeholders to unblock prototype work, explicitly flagged with TODOs for confirming current-year values.

### Mobile navigation (`mobile/src/navigation/index.tsx`)

Simple stack: Onboarding → Dashboard → Capture (modal). No auth yet, so the app always starts at Onboarding. Onboarding is still a stub (structure only). Dashboard is implemented — it fetches `GET /entries` (refetching on focus, so it refreshes after a confirmed capture), shows the Salário bucket headline, the four bucket cards, period totals, and the entry list. Capture is fully implemented.

## Infrastructure (live, as of this prototype's deployment)

- **Database:** Supabase Postgres. `backend/.env`'s `DATABASE_URL` points at the Supabase transaction pooler. RLS is enabled on `User`, `BucketConfig`, and `Entry`.
- **Backend hosting:** Railway, project `fluxo-backend`, service `fluxo-app`, connected to this GitHub repo (`itsmeluan/fluxo-app`, branch `main`) with auto-deploy on push. The service's Root Directory is set to `/backend` (required — Railway's Railpack build auto-detection scans repo root by default, and this is a monorepo).
- **Vision API:** `ANTHROPIC_API_KEY` (Anthropic Console key) is required by `visionExtraction.ts` and is configured both in `backend/.env` (local dev) and as a Railway service variable (production) — these are separate values that must each be kept in sync manually if rotated.
- Known dependency gotcha: `@fastify/multipart` must stay on a `8.x` release (currently pinned `^8.3.0`) — `9.x` requires Fastify 5, while this project is on Fastify `^4.28.1`. Bumping past 8.x without also migrating Fastify itself will crash the server at boot with `FST_ERR_PLUGIN_VERSION_MISMATCH`.
