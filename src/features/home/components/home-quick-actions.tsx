"use client";

import { Icon, type IconName } from "@/components/common/icon";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type QuickActionId = "generateArticle" | "createProject" | "manualArticle";

const QUICK_ACTIONS: {
  id: QuickActionId;
  icon: IconName;
  iconClassName: string;
}[] = [
  {
    id: "generateArticle",
    icon: "auto_awesome",
    iconClassName: "bg-primary/10 text-primary",
  },
  {
    id: "createProject",
    icon: "create_new_folder",
    iconClassName: "bg-tertiary text-tertiary-foreground",
  },
  {
    id: "manualArticle",
    icon: "edit_note",
    iconClassName: "bg-success text-success-foreground",
  },
];

export function HomeQuickActions() {
  const t = useTranslations("Home.QuickActions");

  return (
    <section
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      aria-label={t("label")}
    >
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-start transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span
            className={cn(
              "flex size-16 shrink-0 items-center justify-center rounded-lg",
              action.iconClassName,
            )}
          >
            <Icon name={action.icon} size={28} weight={300} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">
              {t(`items.${action.id}.title`)}
            </span>
            <span className="mt-0.5 block text-sm text-muted-foreground">
              {t(`items.${action.id}.description`)}
            </span>
          </span>
        </button>
      ))}
    </section>
  );
}
