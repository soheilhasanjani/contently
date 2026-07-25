"use client";

import {
  AiContentGenerator01Icon,
  FileEditIcon,
  FolderAddIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { useTranslations } from "next-intl";

type QuickActionId = "generateArticle" | "createProject" | "manualArticle";

const QUICK_ACTIONS: {
  id: QuickActionId;
  icon: IconSvgElement;
}[] = [
  { id: "generateArticle", icon: AiContentGenerator01Icon },
  { id: "createProject", icon: FolderAddIcon },
  { id: "manualArticle", icon: FileEditIcon },
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
          className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-start transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={action.icon} strokeWidth={2} className="size-4" />
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
