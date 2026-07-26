"use client";

import { useTranslations } from "next-intl";

export function CalendarDayEmpty() {
  const t = useTranslations("Calendar");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border px-3 py-6 text-center">
      <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("emptyDescription")}
      </p>
    </div>
  );
}
