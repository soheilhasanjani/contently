"use client";

import { ArticleCard } from "@/components/common/article-card";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/icon";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import type { ProjectArticle, ProjectLayout } from "../data/project-mock";
import { ProjectArticleRow } from "./project-article-row";

type ProjectDayGroupProps = {
  date: string;
  articles: ProjectArticle[];
  layout: ProjectLayout;
  formatEditedLabel: (updatedAt: string) => string;
};

function formatDayLabel(
  date: string,
  locale: string,
  t: ReturnType<typeof useTranslations<"Projects">>,
): string {
  const day = dayjs(date).locale(locale);
  const today = dayjs().startOf("day");
  const target = day.startOf("day");
  const diff = today.diff(target, "day");

  if (diff === 0) return t("today");
  if (diff === 1) return t("yesterday");

  return day.format("D MMM YYYY");
}

export function ProjectDayGroup({
  date,
  articles,
  layout,
  formatEditedLabel,
}: ProjectDayGroupProps) {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const isList = layout === "list";

  return (
    <section
      className={cn(
        "space-y-1.5",
        isList && "rounded-lg bg-muted px-3 pt-3 pb-1",
      )}
      aria-labelledby={`project-day-${date}`}
    >
      <header className="flex items-center justify-between gap-3">
        <h2
          id={`project-day-${date}`}
          className="flex min-w-0 items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        >
          <Icon name="calendar_month" size={14} className="shrink-0" />
          <span className="truncate">{formatDayLabel(date, locale, t)}</span>
        </h2>
        <p className="shrink-0 text-xs text-muted-foreground">
          {t("articleCount", { count: articles.length })}
        </p>
      </header>

      {isList ? (
        <ul className="-mx-2 divide-y divide-border overflow-hidden rounded-md bg-background">
          {articles.map((article) => (
            <ProjectArticleRow
              key={article.id}
              article={article}
              lastEditedLabel={formatEditedLabel(article.updatedAt)}
            />
          ))}
        </ul>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              status={article.status}
              lastEditedLabel={formatEditedLabel(article.updatedAt)}
              authorName={article.authorName}
              authorImageUrl={article.authorImageUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}
