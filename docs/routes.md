# Route helpers (generated)

`src/lib/routes.ts` is **auto-generated** and **gitignored**. Developers do not edit it.

## How it works

1. `scripts/generate-routes.mjs` scans `src/app/**/page.tsx` (under `[locale]`).
2. Emits typed helpers: `routes.panel.dashboard()`, `routes.auth.login({ next })`, …
3. Builds `panelNextAllowlist` from all static `/panel/...` paths.
4. Adds `resolveNextPath()` for safe post-login redirects.

Committed config (aliases / extras / defaults): [`scripts/routes.config.mjs`](../scripts/routes.config.mjs).

## Commands

| Script | Purpose |
| --- | --- |
| `npm run routes:generate` | One-shot generate |
| `npm run routes:watch` | Watch `src/app` and regenerate |
| `npm run dev` | Generate once, then watch + `next dev` |
| `npm run build` | Generate via `prebuild`, then build |

## Conventions

- Locale prefix is omitted (next-intl adds it).
- Route groups `(name)` are ignored in the URL.
- Dynamic segments: `[id]` → `routes.…({ id })`.
- Override names / search params in `routes.config.mjs` (`aliases`, `extraRoutes`).
- Navigate only via generated `routes.*` — no raw path strings in features.
