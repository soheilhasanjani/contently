"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon, type IconName } from "@/components/common/icon";
import { cn } from "@/lib/utils";
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
  { icon: IconName; className: string }
> = {
  waitingReview: {
    icon: "schedule",
    className: "bg-info text-info-foreground",
  },
  beingEdited: {
    icon: "edit",
    className: "bg-tertiary text-tertiary-foreground",
  },
  revision: {
    icon: "refresh",
    className: "bg-warning text-warning-foreground",
  },
  approved: {
    icon: "check_circle",
    className: "bg-success text-success-foreground",
  },
};

function authorInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed || trimmed === "-") return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
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
        <div
          className="pointer-events-none absolute inset-x-3 top-[22%] bottom-0 flex justify-center sm:inset-x-4"
          aria-hidden
        >
          <div className="flex h-[170%] w-full max-w-[16.5rem] flex-col gap-2.5 rounded-t-sm border border-b-0 border-border/60 bg-background px-4 pt-4 shadow-xs">
            <p className="line-clamp-2 text-[10px] font-semibold leading-snug text-foreground">
              {title}
            </p>
            <div className="mt-0.5 flex flex-col gap-1.5">
              <div className="h-1 w-full rounded-full bg-muted-foreground/15" />
              <div className="h-1 w-[92%] rounded-full bg-muted-foreground/15" />
              <div className="h-1 w-full rounded-full bg-muted-foreground/15" />
              <div className="h-1 w-4/5 rounded-full bg-muted-foreground/15" />
              <div className="h-1 w-full rounded-full bg-muted-foreground/15" />
              <div className="h-1 w-3/5 rounded-full bg-muted-foreground/15" />
            </div>
          </div>
        </div>

        <span
          className={cn(
            "absolute start-2 top-2 z-10 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
            statusStyle.className,
          )}
        >
          <Icon name={statusStyle.icon} size={14} />
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
