"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  Edit02Icon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { useTranslations } from "next-intl";

export const ARTICLE_STATUSES = [
  "waitingReview",
  "beingEdited",
  "revision",
  "approved",
] as const;

export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export type ArticleCardProps = {
  title: string;
  status: ArticleStatus;
  lastEditedLabel: string;
  authorName: string;
  authorImageUrl?: string | null;
  className?: string;
};

const STATUS_STYLES: Record<
  ArticleStatus,
  { icon: IconSvgElement; className: string }
> = {
  waitingReview: {
    icon: Clock01Icon,
    className: "bg-info text-info-foreground",
  },
  beingEdited: {
    icon: Edit02Icon,
    className: "bg-tertiary text-tertiary-foreground",
  },
  revision: {
    icon: Refresh01Icon,
    className: "bg-warning text-warning-foreground",
  },
  approved: {
    icon: CheckmarkCircle02Icon,
    className: "bg-success text-success-foreground",
  },
};

function authorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

/** Shared borderless article card — preview, status, title, edit meta + author. */
export function ArticleCard({
  title,
  status,
  lastEditedLabel,
  authorName,
  authorImageUrl,
  className,
}: ArticleCardProps) {
  const t = useTranslations("Article");
  const statusStyle = STATUS_STYLES[status];

  return (
    <article className={cn("flex flex-col gap-3", className)}>
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-muted">
        <span
          className={cn(
            "absolute start-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
            statusStyle.className,
          )}
        >
          <HugeiconsIcon
            icon={statusStyle.icon}
            strokeWidth={2}
            className="size-3.5"
          />
          {t(`status.${status}`)}
        </span>
      </div>

      <h3 className="line-clamp-2 text-sm font-semibold tracking-tight text-foreground">
        {title}
      </h3>

      <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
        <span className="shrink-0">{lastEditedLabel}</span>
        <span aria-hidden>·</span>
        <Avatar size="sm" className="size-5 after:border-0">
          {authorImageUrl ? (
            <AvatarImage src={authorImageUrl} alt="" />
          ) : null}
          <AvatarFallback className="text-[9px]">
            {authorInitials(authorName)}
          </AvatarFallback>
        </Avatar>
        <span className="min-w-0 truncate">{authorName}</span>
      </div>
    </article>
  );
}
