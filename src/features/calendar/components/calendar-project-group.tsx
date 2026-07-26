"use client";

import { cn } from "@/lib/utils";
import type { CalendarArticle, CalendarProject } from "../data/calendar-mock";
import { PROJECT_COLOR_CLASSES } from "../data/calendar-mock";
import { CalendarArticleCard } from "./calendar-article-card";

type CalendarProjectGroupProps = {
  project: CalendarProject;
  articles: CalendarArticle[];
};

export function CalendarProjectGroup({
  project,
  articles,
}: CalendarProjectGroupProps) {
  const color = PROJECT_COLOR_CLASSES[project.color];
  const initial = project.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={cn("flex flex-col gap-2 rounded-lg p-2.5 pb-1", color.group)}
    >
      <header className="flex items-center gap-2 px-0.5">
        <span
          className={cn(
            "inline-flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
            color.box,
          )}
          aria-hidden
        >
          {initial}
        </span>
        <span className="min-w-0 truncate text-xs font-semibold text-foreground">
          {project.name}
        </span>
      </header>

      <div className="-mx-1.5 flex flex-col gap-1.5">
        {articles.map((article) => (
          <CalendarArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
