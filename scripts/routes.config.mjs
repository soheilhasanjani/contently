/**
 * Committed config for route codegen.
 * Output `src/lib/routes.ts` is gitignored — do not edit it by hand.
 */

/** @type {import('./generate-routes.mjs').RoutesConfig} */
const config = {
  appDir: "src/app",
  localeSegment: "[locale]",
  outputFile: "src/lib/routes.ts",

  /**
   * Override helper keys / search params for specific pathnames.
   * Pathnames are locale-unprefixed (e.g. `/`, `/home`).
   */
  aliases: {
    "/": {
      key: ["auth", "login"],
      searchParams: ["next"],
    },
  },

  extraRoutes: [],

  /** `resolveNextPath` falls back here when `next` is missing/invalid. */
  defaultNextKey: ["home"],

  /**
   * Paths that must NOT be used as post-login `next` targets.
   * All other static generated paths are allowlisted.
   */
  publicPaths: ["/", "/unauthorized", "/access-denied"],
};

export default config;
