import { routing, type AppLocale } from "@/i18n/routing";

function isAppLocale(value: string | undefined | null): value is AppLocale {
  return Boolean(value && routing.locales.includes(value as AppLocale));
}

function readLocaleCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("NEXT_LOCALE="));

  if (!match) return null;
  return decodeURIComponent(match.slice("NEXT_LOCALE=".length)) || null;
}

/** Resolve active UI locale for API `Accept-Language` (browser). */
export function getRequestLocale(): AppLocale {
  if (typeof window !== "undefined") {
    const fromPath = window.location.pathname.match(/^\/(en|fa)(?=\/|$)/)?.[1];
    if (isAppLocale(fromPath)) return fromPath;
  }

  const fromCookie = readLocaleCookie();
  if (isAppLocale(fromCookie)) return fromCookie;

  return routing.defaultLocale;
}
