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
| Dates | **dayjs** + locales |
| HTTP | Axios (`src/lib/api/client.ts`) |
| API types & clients | Orval → `src/api/generated/` |
| OpenAPI source | Env URL; config `orval.config.ts` + `npm run api:generate` |
| Auth cookie | `access_token` (7-day expiry; `Secure` + `SameSite=Lax` + `Path=/`) |
| Route guards | Middleware on `/panel`; unauthenticated → `/{locale}/?next=…` |
| Route helpers | Typed path functions (e.g. `routes.panel.dashboard()`) for all navigation |
| i18n | `next-intl`; locales `en` (LTR), `fa` (RTL); default **`fa`** |
| Fonts | **Inter** (`en`) + **Vazirmatn** (`fa`) — apply after shadcn when requested |
| Icons | Install when needed (e.g. lucide with/after UI setup) |
| Toasts | Install manually when first needed (not via shadcn CLI) |
| Env | Zod-validated module + `.env.example` |
| Quality | ESLint + TypeScript + Prettier |

## Architecture

- This repo is **frontend only**. Persist and business logic stay on the API.
- Prefer **Server Components**; add `"use client"` only when required.
- Dynamic-import heavy panels (editor, AI UI) to protect the bundle.
- Use Next.js primitives (`next/font`, `next/image`, etc.) instead of raw equivalents.
- Compose client providers in a single **`AppProviders`** module; document provider order in that file.

## Naming & imports

- **Files**: kebab-case (`user-menu.tsx`); components inside are PascalCase.
- **Feature pages**: `sth-page.tsx` exporting `SthPage` (e.g. `login-page.tsx` → `LoginPage`).
- **`cn`**: comes from shadcn CLI setup (`lib/utils.ts`); do not hand-roll ahead of shadcn init.
- **Imports**:
  - Shared code: aliases (`@/components`, `@/lib`, `@/messages`, …).
  - Inside the same feature: **relative** imports.
- Cross-feature imports should go through shared layers when possible, not deep reach into another feature’s internals.

## Routing map

| Path | Purpose |
| --- | --- |
| `/{locale}` | Auth / login (only public app page) |
| `/{locale}/panel/…` | Private panel (middleware-protected) |
| `/{locale}/panel/dashboard` | Panel home (post-login landing) |
| `/{locale}/unauthorized` | 401 page (cookie present but invalid/expired) |
| `/{locale}/access-denied` | Forbidden / access denied |
| `/{locale}` + `not-found` / `error` | 404 and error UI |

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

### Typed route helpers

- Maintain a central routes module (e.g. `src/lib/routes.ts`) with **functions** for every app path.
- All `Link`, `router.push`, `redirect`, and middleware redirects use these helpers — no raw path string literals scattered in features.
- Example: `router.push(routes.panel.dashboard())`, `routes.auth.login({ next })`, `routes.panel.post({ id })`.
- Prefer a small in-repo typed helper module; introduce a library only if helpers become unwieldy.

### `next` query safety

- After login, honor `next` only if it matches an **allowlist of specific panel routes** (via the same route helpers / path patterns).
- Invalid or unknown `next` → `routes.panel.dashboard()`.

## Folder structure

```text
src/
  app/[locale]/             # see routing map
  api/generated/            # Orval output (do not hand-edit)
  features/<feature>/
    pages/                  # *-page.tsx → *Page (no barrels)
    components/
    hooks/
  components/
    ui/                     # shadcn primitives
    common/                 # shared complex UI + AppProviders
  messages/en.json|fa.json
  lib/
    api/client.ts
    auth/cookie.ts
    routes.ts               # typed route helpers
    env.ts
  stores/
  i18n/
  middleware.ts
```

### Path aliases

- `@/*` → `src/*`
- Also: `@/features/*`, `@/components/*`, `@/lib/*`, `@/messages/*`

## API & auth

### Orval + Axios + Query

- Orval: root **`orval.config.ts`** + script **`npm run api:generate`** → `src/api/generated/`.
- Orval **`react-query`** mode (generated hooks).
- Shared Axios: **`src/lib/api/client.ts`**.
- OpenAPI URL from env.
- Prefer Orval types for API contracts; hand-write props/lib/utils types.

### Auth cookie & session

- Cookie name: **`access_token`**.
- Flags: **`Secure`**, **`SameSite=Lax`**, **`Path=/`** (JS-readable).
- Expiry: **7 days** (`Max-Age` / equivalent).
- Login: frontend **sets** cookie from `POST /auth/login` token.
- Axios interceptor: cookie → `Authorization: Bearer <token>`.
- Logout: clear cookie + clear Query cache + redirect via `routes.auth.login()`.

### Middleware & redirects

- Protect **`/{locale}/panel/**` only**.
- No cookie → `routes.auth.login({ next })`.
- Cookie on auth page → `routes.panel.dashboard()`.
- `NEXT_LOCALE` via **next-intl** middleware/helpers.

### Current user (`/auth/me`)

- Fetch **only inside the private panel** shell → **Zustand user store**.
- Do not load `/me` on the public auth page.

### 401 / 403

- API **401** (cookie context) → `routes.unauthorized()` page with **button to login**.
- **403** → `routes.accessDenied()`.
- Also: 404 + error pages.

## State

- **TanStack Query**: server/async data (Orval hooks).
- **Zustand**: shell + panel current user — **not** theme.
- **nuqs**: URL/filter state.
- User session in Zustand is the allowed server-data exception; do not mirror arbitrary lists.

## i18n, theme, fonts

- **`next-intl`**: `en` / `fa`; prefix routes; `messages/{locale}.json`; full RTL for `fa`.
- Default locale resolution: `NEXT_LOCALE` → `Accept-Language` → **`fa`**.
- Locale layout: next-intl + `lang`/`dir` + providers via **`AppProviders`**.
- **`next-themes`**: `class="dark"`; system default then browser storage; not in Zustand.
- Fonts: **Inter** + **Vazirmatn** via `next/font`, applied **after shadcn init when explicitly requested** (not automatically during shadcn setup).

## Forms & dates

- Forms: React Hook Form + Zod.
- Dates/numbers display: **dayjs** + locales (lightweight).

## Components & extras

- shadcn CLI → `components/ui`; complex shared → `components/common`.
- **`cn`**: from shadcn install.
- Toasts: **install manually** when first needed (not shadcn CLI).
- Icons: install when needed.
- TipTap deferred until editor work.

## Environment & quality

- Zod-validated env + `.env.example`; fail fast.
- ESLint + TypeScript + Prettier.

## Implementation order

1. Foundation: `next-intl`, `next-themes`, `nuqs`, `zod`, env, **typed `routes` helpers**.
2. shadcn/ui (+ `cn`); then apply **Inter / Vazirmatn** when asked.
3. Axios + Orval + Query + auth cookie/middleware/panel shell + dayjs as needed.
4. Manual toast + icons when first UI needs them.
5. TipTap when editor starts.

## Deferred

- TipTap editor packaging.
- Font wiring until post-shadcn request.
- Toast/icon packages until first use (manual install).
