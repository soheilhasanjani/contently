"use client";

import { DirectionProvider } from "@/components/ui/direction";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

type AppProvidersProps = {
  children: React.ReactNode;
  direction: "ltr" | "rtl";
};

/**
 * Client providers composition (outer → inner):
 * 1. DirectionProvider — Base UI / shadcn RTL-LTR behavior
 * 2. ThemeProvider — `class="dark"` on `<html>`, system default + storage
 * 3. NuqsAdapter — URL search-param state
 *
 * Note: `NextIntlClientProvider` stays in the server locale layout.
 * Add `QueryClientProvider` here when the API stack lands.
 */
export function AppProviders({ children, direction }: AppProvidersProps) {
  return (
    <DirectionProvider direction={direction}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NuqsAdapter>{children}</NuqsAdapter>
      </ThemeProvider>
    </DirectionProvider>
  );
}
