"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArchiveRestoreIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import {
  PROJECT_COLOR_CLASSES,
  type ArchivedArticle,
  type ArchivedProject,
} from "../data/archived-mock";

type ArchivedArticleRowProps = {
  article: ArchivedArticle;
  project: ArchivedProject;
  restoring: boolean;
  onRestore: (id: number) => void;
};

export function ArchivedArticleRow({
  article,
  project,
  restoring,
  onRestore,
}: ArchivedArticleRowProps) {
  const t = useTranslations("Archived");
  const color = PROJECT_COLOR_CLASSES[project.color];

  return (
    <li className="flex items-center gap-2 px-2.5 py-2">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {article.title}
        </p>
        <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className={cn("size-1.5 shrink-0 rounded-full", color.box)}
            aria-hidden
          />
          <span className="truncate">{project.name}</span>
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={restoring}
        onClick={() => onRestore(article.id)}
      >
        <HugeiconsIcon icon={ArchiveRestoreIcon} strokeWidth={2} />
        {restoring ? t("restoring") : t("restore")}
      </Button>
    </li>
  );
}
