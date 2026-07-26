"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { ArticleStatus } from "@/components/common/article-card";
import type { ProjectArticle } from "../data/project-mock";

const STATUS_BADGE_STYLES: Record<ArticleStatus, string> = {
  waitingReview: "bg-info text-info-foreground",
  beingEdited: "bg-tertiary text-tertiary-foreground",
  revision: "bg-warning text-warning-foreground",
  approved: "bg-success text-success-foreground",
};

function authorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

type ProjectArticleRowProps = {
  article: ProjectArticle;
  lastEditedLabel: string;
};

export function ProjectArticleRow({
  article,
  lastEditedLabel,
}: ProjectArticleRowProps) {
  const t = useTranslations("Article");

  return (
    <li className="flex items-center gap-2.5 px-2.5 py-2">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {article.title}
        </p>
        <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="shrink-0">{lastEditedLabel}</span>
          <span aria-hidden>·</span>
          <Avatar size="sm" className="size-4 after:border-0">
            {article.authorImageUrl ? (
              <AvatarImage src={article.authorImageUrl} alt="" />
            ) : null}
            <AvatarFallback className="text-[8px]">
              {authorInitials(article.authorName)}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 truncate">{article.authorName}</span>
        </div>
      </div>

      <span
        className={cn(
          "hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline-flex",
          STATUS_BADGE_STYLES[article.status],
        )}
      >
        {t(`status.${article.status}`)}
      </span>
    </li>
  );
}
