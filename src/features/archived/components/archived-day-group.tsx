"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import type { ArchivedArticle, ArchivedProject } from "../data/archived-mock";
import { ArchivedArticleRow } from "./archived-article-row";

type ArchivedDayGroupProps = {
  date: string;
  articles: ArchivedArticle[];
  projectsById: Map<string, ArchivedProject>;
  restoringId: number | null;
  onRestore: (id: number) => void;
};

function formatDayLabel(
  date: string,
  locale: string,
  t: ReturnType<typeof useTranslations<"Archived">>,
): string {
  const day = dayjs(date).locale(locale);
  const today = dayjs().startOf("day");
  const target = day.startOf("day");
  const diff = today.diff(target, "day");

  if (diff === 0) return t("today");
  if (diff === 1) return t("yesterday");

  return day.format("D MMM YYYY");
}

export function ArchivedDayGroup({
  date,
  articles,
  projectsById,
  restoringId,
  onRestore,
}: ArchivedDayGroupProps) {
  const t = useTranslations("Archived");
  const locale = useLocale();

  return (
    <section
      className="space-y-1.5 rounded-lg bg-muted px-3 pt-3 pb-1"
      aria-labelledby={`archived-day-${date}`}
    >
      <header className="flex items-center justify-between gap-3">
        <h2
          id={`archived-day-${date}`}
          className="flex min-w-0 items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        >
          <HugeiconsIcon
            icon={Calendar03Icon}
            strokeWidth={2}
            className="size-3.5 shrink-0"
          />
          <span className="truncate">{formatDayLabel(date, locale, t)}</span>
        </h2>
        <p className="shrink-0 text-xs text-muted-foreground">
          {t("articleCount", { count: articles.length })}
        </p>
      </header>

      <ul className="-mx-2 divide-y divide-border overflow-hidden rounded-md bg-background">
        {articles.map((article) => {
          const project = projectsById.get(article.projectId);
          if (!project) return null;

          return (
            <ArchivedArticleRow
              key={article.id}
              article={article}
              project={project}
              restoring={restoringId === article.id}
              onRestore={onRestore}
            />
          );
        })}
      </ul>
    </section>
  );
}
