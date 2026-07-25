"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { CheckIcon, AlphabetJapaneseIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  fa: "فارسی",
};

export function LocaleSwitcher() {
  const t = useTranslations("PanelShell");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function onLocaleChange(nextLocale: AppLocale) {
    setOpen(false);
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("language")}
          />
        }
      >
        <HugeiconsIcon
          icon={AlphabetJapaneseIcon}
          strokeWidth={1.5}
          className="size-5"
        />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 gap-0.5 p-1">
        {routing.locales.map((item) => {
          const selected = item === locale;

          return (
            <Button
              key={item}
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-between font-normal",
                selected && "bg-muted",
              )}
              onClick={() => onLocaleChange(item)}
            >
              {LOCALE_LABELS[item]}
              {selected ? (
                <HugeiconsIcon icon={CheckIcon} strokeWidth={2} />
              ) : null}
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
