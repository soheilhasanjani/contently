# API service

Contently is frontend-only. The backend OpenAPI spec drives Orval codegen.

## OpenAPI endpoints

| Environment | OpenAPI URL | API base |
| --- | --- | --- |
| Development | `http://localhost:8787/openapi.json` | `http://127.0.0.1:8787` |
| Production | `https://portfolio-api.soheilpcmir.workers.dev/openapi.json` | `https://portfolio-api.soheilpcmir.workers.dev` |

Spec title: **portfolio-api** (see [production OpenAPI](https://portfolio-api.soheilpcmir.workers.dev/openapi.json)).

## Env vars

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Axios / runtime API base URL |
| `OPENAPI_URL` | Orval `api:generate` input (Node-only, not exposed to the browser) |
| `NEXT_PUBLIC_APP_ENV` | `development` \| `production` \| `test` |

See `.env.example` for local defaults.

## Codegen (Orval)

`src/api/generated/` is **gitignored**. It is created by Orval — do not hand-edit or commit it.

```bash
npm run api:generate   # one-shot (uses OPENAPI_URL)
npm run codegen        # routes + Orval
```

Runs automatically on:
- `npm run predev` / `npm run dev`
- `npm run prebuild` / `npm run build`

Falls back to production OpenAPI if `OPENAPI_URL` is unset.

Runtime: Axios `src/lib/api/client.ts` + Orval mutator `src/lib/api/mutator.ts` (Bearer from `access_token` cookie; `Accept-Language: en|fa` from active locale). Error mapper: `src/lib/api/error-mapper.ts`.

## Auth endpoints (used by Contently)

Frontend stores `token` in the `access_token` cookie and sends `Authorization: Bearer …`.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/auth/login` | Body `{ username, password }` → `{ data: { token, tokenType } }` |
| `GET` | `/auth/me` | Bearer token → `{ data: { id, username, name, email } }` |
| `POST` | `/auth/logout` | Invalidate session; frontend then clears cookie + cache |

## Notes

- Other OpenAPI paths (system/services) may exist for portfolio demos; Contently auth uses login, me, and logout.
- Do not commit secrets. Keep `.env*.local` out of git.
