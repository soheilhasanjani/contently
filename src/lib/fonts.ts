import { Inter, Vazirmatn } from "next/font/google";
import localFont from "next/font/local";
import { isRtlLocale } from "@/i18n/routing";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-sans",
  display: "swap",
});

export const materialSymbolsRounded = localFont({
  src: "../assets/fonts/msr-variable.ttf",
  variable: "--font-msr",
  display: "block",
  adjustFontFallback: false,
  weight: "100 700",
});

export function getAppFont(locale: string) {
  return isRtlLocale(locale) ? vazirmatn : inter;
}
