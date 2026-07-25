import { Inter, Vazirmatn } from "next/font/google";
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

export function getAppFont(locale: string) {
  return isRtlLocale(locale) ? vazirmatn : inter;
}
