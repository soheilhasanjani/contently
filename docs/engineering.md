# Contently engineering conventions

Frontend-only Next.js app. Backend lives in a separate API project. This doc is the source of truth for code standards; Cursor rules mirror it.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js (App Router), Server Components by default |
| UI | shadcn/ui (Base UI) via CLI; TipTap later for editor |
| Server state | TanStack Query via **Orval `react-query` hooks** |
| Client global state | Zustand (shell prefs, etc. — not theme) |
| Theme | `next-themes` → `class="dark"` on `<html>` |
| URL / filter state | nuqs |
| Forms | React Hook Form + Zod |
| HTTP | Axios (`src/lib/api/client.ts`) |
| API types & clients | Orval → `src/api/generated/` |
| OpenAPI source | Env URL (e.g. `OPENAPI_URL` / backend `/openapi.json`) |
| Auth | JS-readable cookie → `Authorization: Bearer <token>` |
| Route guards | Next.js middleware → `/{locale}/login` |
| i18n | `next-intl`; locales `en` (LTR), `fa` (RTL); default **`fa`** |
| Env | Zod-validated module + `.env.example` |
| Quality | ESLint + TypeScript + Prettier |

## Architecture

- This repo is **frontend only**. Persist and business logic stay on the API.
- Prefer **Server Components**; add `"use client"` only when browser APIs, interactivity, or client libraries require it.
- Dynamic-import heavy panels (editor, AI UI) to protect the bundle.
- Use Next.js primitives (`next/font`, `next/image`, etc.) instead of raw equivalents.

## Folder structure

```text
src/
  app/
    [locale]/               # locale-prefixed routes (/en, /fa)
  api/
    generated/              # Orval output (do not hand-edit)
  features/
    <feature>/
      pages/                # imported directly by app routes (no barrels)
      components/
      hooks/
      ...
  components/
    ui/                     # shadcn primitives
    common/                 # shared complex UI
  messages/
    en.json
    fa.json
  lib/
    api/
      client.ts             # shared Axios instance + auth interceptor
    env.ts                  # Zod-validated env
    ...
  stores/                   # Zustand (non-theme)
  i18n/                     # next-intl request/routing config
  middleware.ts             # auth redirects + locale handling (or root middleware)
```

Rules:

- `app/[locale]/…` wires routes; import feature pages **by path** (no feature barrels).
- Feature code is grouped by type (`pages`, `components`, `hooks`, …).
- Put tiny primitives in `components/ui`; put reusable composite UI in `components/common`.
- Translation files are global: `messages/{locale}.json`.

### Path aliases

- `@/*` → `src/*`
- Also: `@/features/*`, `@/components/*`, `@/lib/*`, `@/messages/*`

## API & auth

### Orval + Axios + Query

- Orval generates into **`src/api/generated/`** (models + clients together).
- Use Orval **`react-query`** mode (generated hooks).
- Shared Axios instance: **`src/lib/api/client.ts`** (`baseURL`, interceptors).
- OpenAPI spec URL from env (backend OpenAPI endpoint).
- Prefer Orval types for API payloads/responses; hand-write types for props/lib/utils.

### Auth

- `POST /auth/login` → token; frontend stores token in a **JS-readable cookie**.
- `GET /auth/me` for current user.
- Axios request interceptor: read cookie → `Authorization: Bearer <token>`.
- **Middleware** protects panel routes; unauthenticated → `/{locale}/login`.
- Central API error mapper in `lib`; UX: error boundaries, toasts, inline errors, Suspense/skeletons, mutation errors.

## State

- **TanStack Query** (via Orval hooks): server/async data only.
- **Zustand**: cross-route UI/global client state — **not** theme.
- **nuqs**: filters, tabs, and other URL-serializable UI state.
- Do not duplicate server data in Zustand.

## i18n & theme

### i18n (`next-intl`)

- Library: **`next-intl`** (App Router).
- Locales: **`en`** (LTR), **`fa`** (RTL).
- Routing: locale **prefix** — `/en/...`, `/fa/...`.
- Messages: global `messages/en.json`, `messages/fa.json`.
- No hardcoded user-facing strings; always use `next-intl`.
- Full RTL: set `dir` from locale, prefer logical CSS, mirror layout for `fa`.
- Locale layout owns: **`next-intl` provider**, `lang`/`dir` on `<html>`, **ThemeProvider**.
- Unprefixed `/` resolution order: **`NEXT_LOCALE` cookie** → **`Accept-Language`** → default **`fa`**.

### Theme (`next-themes` + shadcn)

- Use **`next-themes`** (matches shadcn dark mode).
- Apply via `class="dark"` on `<html>` (Tailwind `dark:` variant).
- First visit: follow **system** preference.
- After user chooses light/dark: persist in **browser storage** and honor that next time.
- Avoid theme flash: ThemeProvider + `suppressHydrationWarning` on `<html>` as needed.
- Do **not** put theme state in Zustand — `next-themes` owns it.

## Forms

- React Hook Form + Zod schemas for login, settings, and other forms.
- Surface API/field errors inline; use toasts for non-field failures.

## Components

- Add common controls with the **shadcn CLI** into `components/ui`.
- Build missing complex shared UI in `components/common`.
- TipTap and other libraries cover editor/specialized surfaces (TipTap setup deferred).
- Avoid wrapping every shadcn primitive; wrap when reuse or design tokens demand it.

## Environment

- Public config via `NEXT_PUBLIC_*` (API base URL, etc.).
- OpenAPI URL for Orval generation (env).
- Validate env with Zod at boot; fail fast on missing/invalid values.
- Keep `.env.example` documented and in sync.

## Quality gates

- ESLint + TypeScript (strict) + Prettier before merge.
- Production-grade: clean structure, explicit types at boundaries, no drive-by refactors.

## Implementation order

1. Foundation: `next-intl`, `next-themes`, `nuqs`, `zod`, validated env.
2. Then shadcn/ui + theme wiring.
3. Then Axios + Orval + TanStack Query + auth middleware/login.
4. TipTap when editor work starts.

## Deferred

- TipTap editor packaging and extensions — set up when the editor feature starts.
