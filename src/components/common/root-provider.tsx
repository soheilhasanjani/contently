import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { isRtlLocale } from "@/i18n/routing";
import { getAppFont, materialSymbolsRounded } from "@/lib/fonts";
import { cn } from "@/lib/utils";

type RootProviderProps = {
  locale: string;
  children: ReactNode;
};

/**
 * Server-only root shell: `<html>` / `<body>`, fonts, and `NextIntlClientProvider`.
 * Used from `[locale]/layout` so locale/messages refresh on locale navigations.
 * Do not mark this file with `"use client"`.
 */
export function RootProvider({ locale, children }: RootProviderProps) {
  const direction = isRtlLocale(locale) ? "rtl" : "ltr";
  const font = getAppFont(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={cn("h-full", font.variable, materialSymbolsRounded.variable)}
    >
      <body className={cn("flex min-h-full flex-col antialiased", font.className)}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
