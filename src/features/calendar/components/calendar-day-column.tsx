"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import type {
  CalendarArticle,
  CalendarProject,
} from "../data/calendar-mock";
import { CalendarArticleCard } from "./calendar-article-card";
import { CalendarDayEmpty } from "./calendar-day-empty";

/** Leaves room for panel top bar + sticky page chrome. */
const COLUMN_MAX_HEIGHT = "max-h-[calc(100svh-13rem)]";

type CalendarDayColumnProps = {
  date: string;
  articles: CalendarArticle[];
  projectsById: Record<string, CalendarProject>;
};

export function CalendarDayColumn({
  date,
  articles,
  projectsById,
}: CalendarDayColumnProps) {
  const t = useTranslations("Calendar");
  const locale = useLocale();
  const { setNodeRef, isOver } = useDroppable({ id: date });
  const day = dayjs(date).locale(locale);

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex w-64 shrink-0 flex-col gap-3 overflow-hidden rounded-xl border border-transparent bg-muted/40 px-3 pt-3 pb-1.5",
        COLUMN_MAX_HEIGHT,
        isOver && "border-primary/40 bg-primary/5",
      )}
      aria-label={day.format("dddd, D MMM YYYY")}
    >
      <header className="flex shrink-0 items-start justify-between gap-2">
        <h2 className="min-w-0 flex-1 text-sm leading-snug font-semibold tracking-tight text-foreground">
          {day.format("dddd, D MMM YYYY")}
        </h2>
        <Badge variant="secondary" className="shrink-0">
          {t("articleCount", { count: articles.length })}
        </Badge>
      </header>

      <div className="-mx-1.5 flex min-h-40 min-w-0 flex-1 flex-col gap-1.5 overflow-y-auto [scrollbar-width:thin]">
        {articles.length === 0 ? (
          <CalendarDayEmpty />
        ) : (
          articles.map((article) => (
            <CalendarArticleCard
              key={article.id}
              article={article}
              project={projectsById[article.projectId]}
            />
          ))
        )}
      </div>
    </section>
  );
}
