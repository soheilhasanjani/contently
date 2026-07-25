# Development phases (temporary)

> **Delete this file when all phases are done.**  
> Working checklist only — lasting conventions live in [`engineering.md`](./engineering.md).

| # | Phase | Status |
| --- | --- | --- |
| 1 | **Foundation** — folders, Zod env, next-intl (`en`/`fa`), next-themes, nuqs, typed `routes.*()` (generated), AppProviders, `app/[locale]` | Done |
| 2 | **UI base** — shadcn/ui (Base UI) + `cn`, RTL `DirectionProvider` | Done |
| 3 | **Fonts** — Inter (`en`) + Vazirmatn (`fa`) | Done |
| 4 | **API layer** — Axios, Orval (gitignored + codegen on build), TanStack Query, error mapper, cookie Bearer helper | Done |
| 5 | **Auth** — login at `/{locale}`, set `access_token`, proxy guard for `/panel`, logout, unauthorized / access-denied pages | Done |
| 6 | **Panel shell** — `/panel` layout, `/me` → Zustand user store, dashboard | Done |
| 7 | **App features** — real panel features as needed | Next |
| 8 | **Editor** — TipTap (deferred until that feature starts) | Deferred |
| — | Toasts / extra icons — install manually when first UI needs them | As needed |
| — | dayjs — when first date UI lands | As needed |

## Current focus

**Phase 7 — App features** (when you have the next feature to build)
