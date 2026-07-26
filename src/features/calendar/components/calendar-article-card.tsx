"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import type { CalendarArticle } from "../data/calendar-mock";

type CalendarArticleCardContentProps = {
  article: CalendarArticle;
  className?: string;
};

export function CalendarArticleCardContent({
  article,
  className,
}: CalendarArticleCardContentProps) {
  const t = useTranslations("Calendar");

  return (
    <article className={cn("rounded-lg bg-background p-3", className)}>
      <h3 className="line-clamp-2 text-sm font-semibold tracking-tight text-foreground">
        {article.title}
      </h3>

      <Separator className="my-2.5" />

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <HugeiconsIcon
          icon={Clock01Icon}
          strokeWidth={2}
          className="size-3.5 shrink-0"
        />
        <span>{t("aroundTime", { time: article.timeRange })}</span>
      </div>
    </article>
  );
}

type CalendarArticleCardProps = {
  article: CalendarArticle;
};

export function CalendarArticleCard({ article }: CalendarArticleCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: article.id });

  return (
    <div
      ref={setNodeRef}
      data-calendar-card=""
      style={{
        transform: isDragging ? undefined : CSS.Translate.toString(transform),
      }}
      className={cn(
        "cursor-grab touch-none active:cursor-grabbing",
        isDragging && "opacity-40",
      )}
      {...listeners}
      {...attributes}
    >
      <CalendarArticleCardContent article={article} />
    </div>
  );
}
