# Contently engineering conventions

Frontend-only Next.js app. Backend lives in a separate API project. This doc is the source of truth for code standards; Cursor rules mirror it.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js (App Router), Server Components by default |
| UI | shadcn/ui (Base UI) via CLI; TipTap later for editor |
| Server state | TanStack Query |
| Client global state | Zustand (shell prefs, etc. — not theme) |
| Theme | `next-themes` → `class="dark"` on `<html>` |
| URL / filter state | nuqs |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| API types & clients | Orval (generated) |
| Auth | Token in cookie → `Authorization: Bearer <token>` |
| i18n | `next-intl`; locales `en` (LTR), `fa` (RTL) |
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
  features/
    <feature>/
      pages/
      components/
      hooks/
      ...
  components/
    ui/                   # shadcn primitives (button, input, select, …)
    common/               # shared complex UI (not single primitives)
  messages/
    en.json
    fa.json
  lib/                    # utils, env, api client setup, error mapper
  stores/                 # Zustand stores (non-theme)
  i18n/                   # next-intl request/routing config
```

Rules:

- `app/[locale]/…` wires routes; page UI lives under `features/*/pages`.
- Feature code is grouped by type (`pages`, `components`, `hooks`, …).
- Put tiny primitives in `components/ui`; put reusable composite UI in `components/common`.
- Translation files are global: `messages/{locale}.json`.

## API & auth

- Call the backend through **Orval-generated clients** backed by a shared **Axios** instance.
- Attach the auth token from the cookie as `Authorization: Bearer <token>`.
- Prefer **Orval types** for API payloads/responses.
- Hand-write types for component props, `lib/`, utils, and non-API surfaces.
- Map API errors in one place (`lib` error mapper) → user messages + logging hooks.
- Pair with consistent UX: error boundaries, toasts, inline field errors, Suspense/skeletons, explicit mutation error states.

## State

- **TanStack Query**: server/async data only.
- **Zustand**: cross-route UI/global client state (shell prefs, etc.) — **not** theme.
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

### Theme (`next-themes` + shadcn)

- Use **`next-themes`** (matches shadcn dark mode).
- Apply via `class="dark"` on `<html>` (Tailwind `dark:` variant).
- First visit: follow **system** preference (`prefers-color-scheme`).
- After user chooses light/dark: persist in **browser storage** (next-themes default) and honor that next time.
- Avoid theme flash: ThemeProvider on the client layout; `suppressHydrationWarning` on `<html>` as needed.
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

- Public config via `NEXT_PUBLIC_*` (e.g. API base URL).
- Validate env with Zod at boot; fail fast on missing/invalid values.
- Keep `.env.example` documented and in sync.

## Quality gates

- ESLint + TypeScript (strict) + Prettier before merge.
- Production-grade: clean structure, explicit types at boundaries, no drive-by refactors.

## Deferred

- TipTap editor packaging and extensions — set up when the editor feature starts.
