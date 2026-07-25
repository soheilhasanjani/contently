import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Inter, Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";
import { AppProviders } from "@/components/common/app-providers";
import { DocumentAttributes } from "@/components/common/document-attributes";
import { isRtlLocale, routing } from "@/i18n/routing";
import { env } from "@/lib/env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-sans",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  void env.NEXT_PUBLIC_API_BASE_URL;

  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const direction = isRtlLocale(locale) ? "rtl" : "ltr";
  const font = isRtlLocale(locale) ? vazirmatn : inter;

  return (
    <>
      <DocumentAttributes
        locale={locale}
        direction={direction}
        fontClassName={font.variable}
      />
      <NextIntlClientProvider>
        <AppProviders direction={direction}>{children}</AppProviders>
      </NextIntlClientProvider>
    </>
  );
}
