# Contently

AI-powered automation platform for blog creation — plan, draft, and manage content workflows from one panel.

This repository is the **frontend** (Next.js App Router). Business logic and persistence live in a separate API service consumed via OpenAPI.

## Features

- Locale-aware auth and private panel (`en` LTR / `fa` RTL, default `fa`)
- Typed API client from OpenAPI (Orval + Axios + TanStack Query)
- Cookie-based Bearer auth with route protection
- Feature-based app structure (`features/*/pages|components|hooks`)
- Generated typed route helpers (`routes.*`)
- Theme support (system / light / dark) and Material Symbols icons

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| UI | shadcn/ui (Base UI), Tailwind CSS 4 |
| i18n | next-intl (`en` / `fa`) |
| Data | TanStack Query, Axios, Orval |
| Forms | React Hook Form + Zod |
| State | Zustand (session), nuqs (URL) |
| Theme | next-themes |
| Icons | Material Symbols Rounded |

## Prerequisites

- Node.js 20+
- npm
- A running Contently / portfolio API (or use the production OpenAPI URL for codegen)

## Getting started

```bash
git clone <repository-url>
cd contently
npm install
cp .env.example .env.local
```

Configure `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Runtime API base URL |
| `OPENAPI_URL` | OpenAPI spec for Orval codegen |
| `NEXT_PUBLIC_APP_ENV` | `development` \| `production` \| `test` |

Defaults for local API:

```env
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8787
OPENAPI_URL=http://localhost:8787/openapi.json
```

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Codegen (routes + Orval) runs automatically on `predev` / `prebuild`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Generate routes/API clients, watch routes, start Next.js |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run codegen` | Regenerate routes + Orval clients |
| `npm run api:generate` | Orval only |
| `npm run routes:generate` | Route helpers only |

## Project structure

```text
src/
  app/[locale]/          # Next.js routes (auth + (panel) private app)
  features/              # Domain UI (auth, home, panel shell, …)
  components/ui|common/  # shadcn primitives + shared UI
  api/generated/         # Orval output (gitignored)
  lib/                   # env, API client, auth cookie, routes
  messages/              # en / fa translations
  stores/                # Zustand
  proxy.ts               # Locale + auth guard (Next.js proxy)
```

## Documentation

| Doc | Contents |
| --- | --- |
| [docs/engineering.md](./docs/engineering.md) | Stack, architecture, conventions |
| [docs/api.md](./docs/api.md) | OpenAPI URLs, env vars, auth endpoints |
| [docs/routes.md](./docs/routes.md) | Typed `routes.*` codegen |

## License

Private — all rights reserved.
