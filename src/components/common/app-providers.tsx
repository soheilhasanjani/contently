"use client";

import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/toast";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState } from "react";

type AppProvidersProps = {
  children: React.ReactNode;
  direction: "ltr" | "rtl";
};

/**
 * Client providers composition (outer → inner):
 * 1. DirectionProvider — Base UI / shadcn RTL-LTR behavior
 * 2. QueryClientProvider — TanStack Query (Orval hooks)
 * 3. ThemeProvider — `class="dark"` on `<html>`, system default + storage
 * 4. NuqsAdapter — URL search-param state
 * 5. Toaster — Base UI / shadcn toasts (`toast.add(...)`)
 *
 * Note: `NextIntlClientProvider` stays in the server locale layout.
 */
export function AppProviders({ children, direction }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <DirectionProvider direction={direction}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NuqsAdapter>
            {children}
            <Toaster />
          </NuqsAdapter>
        </ThemeProvider>
      </QueryClientProvider>
    </DirectionProvider>
  );
}
