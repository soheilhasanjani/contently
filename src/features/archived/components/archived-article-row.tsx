"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ArchiveRestoreIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  PROJECT_COLOR_CLASSES,
  type ArchivedArticle,
  type ArchivedProject,
} from "../data/archived-mock";

type ArchivedArticleRowProps = {
  article: ArchivedArticle;
  project: ArchivedProject;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ArchivedArticleRow({
  article,
  project,
  onRestore,
  onDelete,
}: ArchivedArticleRowProps) {
  const t = useTranslations("Archived");
  const color = PROJECT_COLOR_CLASSES[project.color];
  const [deleteOpen, setDeleteOpen] = useState(false);

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

      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRestore(article.id)}
        >
          <HugeiconsIcon icon={ArchiveRestoreIcon} strokeWidth={2} />
          {t("restore")}
        </Button>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t("delete")}
            onClick={() => setDeleteOpen(true)}
          >
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          </Button>
          <DialogContent className="sm:max-w-md" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>{t("deleteTitle")}</DialogTitle>
              <DialogDescription>
                {t("deleteDescription", { title: article.title })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteOpen(false)}
              >
                {t("deleteCancel")}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onDelete(article.id);
                  setDeleteOpen(false);
                }}
              >
                {t("deleteConfirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </li>
  );
}
