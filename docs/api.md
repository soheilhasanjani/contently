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

## Notes

- Auth routes (`POST /auth/login`, `GET /auth/me`, …) are expected from this API when available; current public spec is mostly system/demo stubs.
- Do not commit secrets. Keep `.env*.local` out of git.
