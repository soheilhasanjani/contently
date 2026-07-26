"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import type { CalendarArticle, CalendarProject } from "../data/calendar-mock";
import { CalendarDayEmpty } from "./calendar-day-empty";
import { CalendarProjectGroup } from "./calendar-project-group";

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

  const projectGroups = useMemo(() => {
    const grouped = new Map<string, CalendarArticle[]>();

    for (const article of articles) {
      const list = grouped.get(article.projectId) ?? [];
      list.push(article);
      grouped.set(article.projectId, list);
    }

    return Array.from(grouped.entries())
      .map(([projectId, projectArticles]) => ({
        project: projectsById[projectId],
        articles: projectArticles,
      }))
      .filter(
        (
          group,
        ): group is { project: CalendarProject; articles: CalendarArticle[] } =>
          Boolean(group.project),
      );
  }, [articles, projectsById]);

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex w-64 shrink-0 flex-col overflow-hidden rounded-xl border border-transparent bg-muted/40",
        COLUMN_MAX_HEIGHT,
        isOver && "border-primary/40 bg-primary/5",
      )}
      aria-label={day.format("dddd, D MMM YYYY")}
    >
      <header className="relative z-10 flex shrink-0 items-start justify-between gap-2 bg-muted px-3 py-3">
        <h2 className="min-w-0 flex-1 text-sm leading-snug font-semibold tracking-tight text-foreground">
          {day.format("dddd, D MMM YYYY")}
        </h2>
        <Badge variant="secondary" className="shrink-0">
          {t("articleCount", { count: articles.length })}
        </Badge>
      </header>

      <div className="flex min-h-40 min-w-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3 pt-2 pb-1.5 [scrollbar-width:thin]">
        {articles.length === 0 ? (
          <CalendarDayEmpty />
        ) : (
          projectGroups.map(({ project, articles: projectArticles }) => (
            <CalendarProjectGroup
              key={project.id}
              project={project}
              articles={projectArticles}
            />
          ))
        )}
      </div>
    </section>
  );
}
