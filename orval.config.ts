import { defineConfig } from "orval";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();

const openApiUrl =
  process.env.OPENAPI_URL ??
  "https://portfolio-api.soheilpcmir.workers.dev/openapi.json";

export default defineConfig({
  contently: {
    input: openApiUrl,
    output: {
      mode: "tags-split",
      target: "src/api/generated/endpoints",
      schemas: "src/api/generated/models",
      client: "react-query",
      httpClient: "axios",
      clean: true,
      override: {
        mutator: {
          path: "src/lib/api/mutator.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
          useInfinite: false,
          signal: true,
        },
      },
    },
  },
});
