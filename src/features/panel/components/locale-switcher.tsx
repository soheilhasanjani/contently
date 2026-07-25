"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "EN",
  fa: "FA",
};

export function LocaleSwitcher() {
  const t = useTranslations("PanelShell");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function onLocaleChange(nextLocale: string | null) {
    if (!nextLocale || nextLocale === locale) return;
    if (!routing.locales.includes(nextLocale as AppLocale)) return;

    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <Select
      value={locale}
      onValueChange={onLocaleChange}
      aria-label={t("language")}
    >
      <SelectTrigger size="sm" className="w-[4.5rem]">
        <SelectValue>{LOCALE_LABELS[locale as AppLocale] ?? locale}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {routing.locales.map((item) => (
          <SelectItem key={item} value={item}>
            {LOCALE_LABELS[item]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
