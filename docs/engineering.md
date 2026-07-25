# Contently engineering conventions

Frontend-only Next.js app. Backend lives in a separate API project. This doc is the source of truth for code standards; Cursor rules mirror it.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js (App Router), Server Components by default |
| UI | shadcn/ui (Base UI) via CLI; TipTap later for editor |
| Server state | TanStack Query |
| Client global state | Zustand (theme, etc.) |
| URL / filter state | nuqs |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| API types & clients | Orval (generated) |
| Auth | Token in cookie → `Authorization: Bearer <token>` |
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
  app/                    # routes only — import feature pages
  features/
    <feature>/
      pages/
      components/
      hooks/
      ...
  components/
    ui/                   # shadcn primitives (button, input, select, …)
    common/               # shared complex UI (not single primitives)
  lib/                    # utils, env, api client setup, error mapper
  stores/                 # Zustand stores
```

Rules:

- `app/` wires routes; page UI lives under `features/*/pages`.
- Feature code is grouped by type (`pages`, `components`, `hooks`, …).
- Put tiny primitives in `components/ui`; put reusable composite UI in `components/common`.

## API & auth

- Call the backend through **Orval-generated clients** backed by a shared **Axios** instance.
- Attach the auth token from the cookie as `Authorization: Bearer <token>`.
- Prefer **Orval types** for API payloads/responses.
- Hand-write types for component props, `lib/`, utils, and non-API surfaces.
- Map API errors in one place (`lib` error mapper) → user messages + logging hooks.
- Pair with consistent UX: error boundaries, toasts, inline field errors, Suspense/skeletons, explicit mutation error states.

## State

- **TanStack Query**: server/async data only.
- **Zustand**: cross-route UI/global client state (theme, shell prefs, …).
- **nuqs**: filters, tabs, and other URL-serializable UI state.
- Do not duplicate server data in Zustand.

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
