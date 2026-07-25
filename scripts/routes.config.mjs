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
   * Pathnames are locale-unprefixed (e.g. `/`, `/panel/dashboard`).
   */
  aliases: {
    "/": {
      key: ["auth", "login"],
      searchParams: ["next"],
    },
  },

  /**
   * Routes to always emit even if `page.tsx` is not created yet.
   * Remove entries once the real app pages exist (scan will cover them).
   */
  extraRoutes: [
    { path: "/unauthorized", key: ["unauthorized"] },
    { path: "/access-denied", key: ["accessDenied"] },
  ],

  /** `resolveNextPath` falls back here when `next` is missing/invalid. */
  defaultNextKey: ["panel", "dashboard"],

  /** Only paths under this prefix may be used as post-login `next`. */
  panelPrefix: "/panel",
};

export default config;
