import type { ReactNode } from "react";
import { Inter, Vazirmatn } from "next/font/google";
import { getLocale } from "next-intl/server";
import { isRtlLocale, routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-sans",
});

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  let locale: string = routing.defaultLocale;
  try {
    locale = await getLocale();
  } catch {
    locale = routing.defaultLocale;
  }

  if (!routing.locales.includes(locale as AppLocale)) {
    locale = routing.defaultLocale;
  }

  const direction = isRtlLocale(locale) ? "rtl" : "ltr";
  const font = isRtlLocale(locale) ? vazirmatn : inter;

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={cn("h-full", font.variable)}
    >
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
