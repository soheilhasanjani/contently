import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fa"],
  defaultLocale: "fa",
  localeDetection: true,
  localeCookie: {
    name: "NEXT_LOCALE",
  },
});

export type AppLocale = (typeof routing.locales)[number];

export function isRtlLocale(locale: string): boolean {
  return locale === "fa";
}
