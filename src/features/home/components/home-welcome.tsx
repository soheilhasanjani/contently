"use client";

import { useUserStore } from "@/stores/user-store";
import { useTranslations } from "next-intl";

export function HomeWelcome() {
  const t = useTranslations("Home");
  const user = useUserStore((s) => s.user);
  const name = user?.name?.trim() || t("guestName");

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold tracking-tight">
        {t("greeting", { name })}
      </h1>
      <p className="text-sm text-muted-foreground">
        {t.rich("savings", {
          highlight: (chunks) => (
            <span className="font-medium text-primary underline underline-offset-2">
              {chunks}
            </span>
          ),
        })}
      </p>
    </div>
  );
}
