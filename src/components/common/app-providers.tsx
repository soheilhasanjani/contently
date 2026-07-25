"use client";

import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

type AppProvidersProps = {
  children: React.ReactNode;
};

/**
 * Client providers composition (outer → inner):
 * 1. ThemeProvider — `class="dark"` on `<html>`, system default + storage
 * 2. NuqsAdapter — URL search-param state
 *
 * Note: `NextIntlClientProvider` stays in the server locale layout.
 * Add `QueryClientProvider` here when the API stack lands.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NuqsAdapter>{children}</NuqsAdapter>
    </ThemeProvider>
  );
}
