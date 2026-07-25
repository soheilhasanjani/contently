import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "./lib/auth/cookie";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

function stripLocale(pathname: string): {
  locale: string | null;
  pathnameWithoutLocale: string;
} {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      const rest = pathname.slice(locale.length + 1) || "/";
      return {
        locale,
        pathnameWithoutLocale: rest.startsWith("/") ? rest : `/${rest}`,
      };
    }
  }
  return { locale: null, pathnameWithoutLocale: pathname };
}

export default function proxy(request: NextRequest) {
  const { locale, pathnameWithoutLocale } = stripLocale(
    request.nextUrl.pathname,
  );

  if (locale) {
    const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const isPanel = pathnameWithoutLocale.startsWith("/panel");
    const isAuthRoot =
      pathnameWithoutLocale === "/" || pathnameWithoutLocale === "";

    if (isPanel && !token) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      url.search = "";
      url.searchParams.set("next", pathnameWithoutLocale);
      return NextResponse.redirect(url);
    }

    if (isAuthRoot && token) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/panel/dashboard`;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
