"use client";

import { useTranslations } from "next-intl";

export function NotificationsHeader() {
  const t = useTranslations("Notifications");

  return (
    <header className="space-y-2">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        {t("title")}
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground">
        {t("description")}
      </p>
    </header>
  );
}
