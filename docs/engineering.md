# Contently engineering conventions

Frontend-only Next.js app. Backend lives in a separate API project. This doc is the source of truth for code standards; Cursor rules mirror it.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js (App Router), Server Components by default |
| UI | shadcn/ui (Base UI) via CLI; TipTap later for editor |
| Server state | TanStack Query via **Orval `react-query` hooks** |
| Client global state | Zustand (shell prefs, **current user in panel**, …) |
| Theme | `next-themes` → `class="dark"` on `<html>` |
| URL / filter state | nuqs |
| Forms | React Hook Form + Zod |
| HTTP | Axios (`src/lib/api/client.ts`) |
| API types & clients | Orval → `src/api/generated/` |
| OpenAPI source | Env URL (e.g. `OPENAPI_URL` / backend `/openapi.json`) |
| Auth cookie | `access_token` (JS-readable; `Secure` + `SameSite=Lax` + `Path=/`) |
| Route guards | Middleware on `/panel`; unauthenticated → `/{locale}/?next=…` |
| i18n | `next-intl`; locales `en` (LTR), `fa` (RTL); default **`fa`** |
| Env | Zod-validated module + `.env.example` |
| Quality | ESLint + TypeScript + Prettier |

## Architecture

- This repo is **frontend only**. Persist and business logic stay on the API.
- Prefer **Server Components**; add `"use client"` only when browser APIs, interactivity, or client libraries require it.
- Dynamic-import heavy panels (editor, AI UI) to protect the bundle.
- Use Next.js primitives (`next/font`, `next/image`, etc.) instead of raw equivalents.

## Routing map

| Path | Purpose |
| --- | --- |
| `/{locale}` | Auth / login (only public app page) |
| `/{locale}/panel/…` | Private panel (middleware-protected) |
| `/{locale}/panel/dashboard` | Panel home (post-login landing) |
| `/{locale}/unauthorized` | 401 page (cookie present but invalid/expired) |
| `/{locale}/access-denied` | Forbidden / access denied |
| `/{locale}` + `not-found` / `error` | 404 and error UI |

Suggested `app` shape (route groups optional for clarity):

```text
src/app/[locale]/
  page.tsx                      # auth (login)
  panel/
    layout.tsx                  # private shell; load /me → Zustand
    dashboard/page.tsx
    ...
  unauthorized/page.tsx
  access-denied/page.tsx
  not-found.tsx
  error.tsx
```

## Folder structure

```text
src/
  app/
    [locale]/               # see routing map
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
    auth/
      cookie.ts             # get/set/clear access_token
    env.ts
    ...
  stores/                   # Zustand (user session, shell, … — not theme)
  i18n/                     # next-intl request/routing config
  middleware.ts             # locale (next-intl) + panel auth cookie check
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

### Auth cookie & session

- Cookie name: **`access_token`**.
- Flags: **`Secure`**, **`SameSite=Lax`**, **`Path=/`** (JS-readable — not httpOnly).
- `POST /auth/login` → token; **frontend sets** the cookie.
- Axios interceptor: read `access_token` → `Authorization: Bearer <token>`.
- Logout: **clear cookie** + **clear TanStack Query cache** + redirect to `/{locale}` (login).

### Middleware & redirects

- Protect **`/{locale}/panel/**` only** (plus static/intl exclusions as needed).
- No cookie on panel → redirect to **`/{locale}?next=<original-path>`**.
- Cookie present on auth page (`/{locale}`) → redirect to **`/{locale}/panel/dashboard`**.
- `NEXT_LOCALE` managed by **next-intl** middleware/helpers on locale change.

### Current user (`/auth/me`)

- Fetch **only inside the private panel** shell.
- Provide user via a **Zustand store** (session/user store) for panel UI.
- Do not load `/me` on the public auth page.

### 401 handling

- If a request returns **401** and a cookie is (or was) present: navigate to **`/{locale}/unauthorized`**.
- That page shows messaging + a **button to login** (`/{locale}`), not an automatic silent redirect loop.
- Distinguish **access denied** (403) → `/{locale}/access-denied`.

### Errors UX (general)

- Central API error mapper in `lib`.
- Error boundaries, toasts, inline field errors, Suspense/skeletons, mutation errors.
- Dedicated system pages: 404, unauthorized, access-denied, error.

## State

- **TanStack Query** (via Orval hooks): server/async data and mutations.
- **Zustand**: shell prefs + **panel current user** (from `/me`) — **not** theme.
- **nuqs**: filters, tabs, and other URL-serializable UI state.
- Do not mirror arbitrary Query lists into Zustand; **user session in Zustand is the allowed exception**.

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
- Locale cookie written via **next-intl** middleware/helpers.

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
3. Then Axios + Orval + TanStack Query + auth middleware/login/panel shell.
4. TipTap when editor work starts.

## Deferred

- TipTap editor packaging and extensions — set up when the editor feature starts.
