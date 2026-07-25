"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

/**
 * Wraps `next-themes` so its FOUC-prevention `<script>` stays executable on SSR,
 * but is marked non-JS on the client. Avoids the React 19 / Next 16 warning when
 * the provider remounts (e.g. locale navigations under `[locale]/layout`).
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : ({ type: "application/json" } as const);

  return (
    <NextThemesProvider {...props} scriptProps={scriptProps}>
      {children}
    </NextThemesProvider>
  );
}
