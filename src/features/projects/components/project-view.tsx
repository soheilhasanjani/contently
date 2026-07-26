"use client";

import { PanelPageLayout } from "@/components/common/panel-page-layout";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fa";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
  MOCK_PROJECT_ARTICLES,
  MOCK_PROJECT_INFO,
  type ProjectArticle,
  type ProjectArticleSortOption,
  type ProjectLayout,
  type ProjectStatusFilter,
} from "../data/project-mock";
import { ProjectDayGroup } from "./project-day-group";
import { ProjectHeader } from "./project-header";
import { ProjectToolbar } from "./project-toolbar";

type DayGroup = {
  date: string;
  articles: ProjectArticle[];
};

type ProjectViewProps = {
  projectId: string;
};

function groupByEditedDay(
  articles: ProjectArticle[],
  sort: ProjectArticleSortOption,
): DayGroup[] {
  const byDate = new Map<string, ProjectArticle[]>();

  for (const article of articles) {
    const list = byDate.get(article.editedAt) ?? [];
    list.push(article);
    byDate.set(article.editedAt, list);
  }

  const dates = [...byDate.keys()].sort((a, b) => {
    if (sort === "oldestEdited") {
      return dayjs(a).valueOf() - dayjs(b).valueOf();
    }
    return dayjs(b).valueOf() - dayjs(a).valueOf();
  });

  return dates.map((date) => {
    const dayArticles = [...(byDate.get(date) ?? [])];

    if (sort === "titleAsc") {
      dayArticles.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "recentlyEdited") {
      dayArticles.sort((a, b) => a.editedMinutesAgo - b.editedMinutesAgo);
    } else {
      dayArticles.sort((a, b) => b.editedMinutesAgo - a.editedMinutesAgo);
    }

    return { date, articles: dayArticles };
  });
}

export function ProjectView({ projectId }: ProjectViewProps) {
  const locale = useLocale();
  const t = useTranslations("Projects");
  const project = MOCK_PROJECT_INFO[projectId];
  const [status, setStatus] = useState<ProjectStatusFilter>("all");
  const [sort, setSort] = useState<ProjectArticleSortOption>("recentlyEdited");
  const [layout, setLayout] = useState<ProjectLayout>("list");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  const projectArticles = useMemo(
    () => MOCK_PROJECT_ARTICLES.filter((article) => article.projectId === projectId),
    [projectId],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projectArticles.filter((article) => {
      if (status !== "all" && article.status !== status) return false;
      if (!query) return true;
      return (
        article.title.toLowerCase().includes(query) ||
        article.authorName.toLowerCase().includes(query)
      );
    });
  }, [projectArticles, search, status]);

  const groups = useMemo(
    () => groupByEditedDay(filtered, sort),
    [filtered, sort],
  );

  function formatEditedLabel(minutesAgo: number): string {
    if (minutesAgo < 60) {
      return t("lastEditedMinutes", { count: minutesAgo });
    }

    const hours = Math.round(minutesAgo / 60);
    if (hours < 24) {
      return t("lastEditedHours", { count: hours });
    }

    const days = Math.round(hours / 24);
    return t("lastEditedDays", { count: days });
  }

  if (!project) {
    return (
      <PanelPageLayout className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">{t("notFoundTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("notFoundDescription", { id: projectId })}
        </p>
      </PanelPageLayout>
    );
  }

  return (
    <PanelPageLayout className="space-y-6 pt-0">
      <div className="sticky top-16 z-20 -mx-6 space-y-4 bg-background px-6 pt-6 pb-4">
        <ProjectHeader name={project.name} description={project.description} />
        <ProjectToolbar
          status={status}
          onStatusChange={setStatus}
          sort={sort}
          onSortChange={setSort}
          layout={layout}
          onLayoutChange={setLayout}
          search={search}
          onSearchChange={setSearch}
          resultCount={filtered.length}
        />
      </div>

      {groups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {groups.map((group) => (
            <ProjectDayGroup
              key={group.date}
              date={group.date}
              articles={group.articles}
              layout={layout}
              formatEditedLabel={formatEditedLabel}
            />
          ))}
        </div>
      )}
    </PanelPageLayout>
  );
}
