"use client";

import {
  getApiContentlyProjectsId,
  getApiContentlyProjectsIdArticles,
} from "@/api/generated/endpoints/contently-projects/contently-projects";
import { PanelPageLayout } from "@/components/common/panel-page-layout";
import { ApiClientError } from "@/lib/api/error-mapper";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fa";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
  getProjectArticlesQueryKey,
  getProjectQueryKey,
  parseProjectId,
  toProjectArticle,
  toProjectInfo,
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
      dayArticles.sort(
        (a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf(),
      );
    } else {
      dayArticles.sort(
        (a, b) => dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf(),
      );
    }

    return { date, articles: dayArticles };
  });
}

function formatEditedLabel(
  updatedAt: string,
  t: ReturnType<typeof useTranslations<"Projects">>,
): string {
  const minutesAgo = Math.max(0, dayjs().diff(dayjs(updatedAt), "minute"));

  if (minutesAgo < 60) {
    return t("lastEditedMinutes", { count: minutesAgo || 1 });
  }

  const hours = Math.round(minutesAgo / 60);
  if (hours < 24) {
    return t("lastEditedHours", { count: hours });
  }

  const days = Math.round(hours / 24);
  return t("lastEditedDays", { count: days });
}

export function ProjectView({ projectId }: ProjectViewProps) {
  const locale = useLocale();
  const t = useTranslations("Projects");
  const numericId = parseProjectId(projectId);
  const [status, setStatus] = useState<ProjectStatusFilter>("all");
  const [sort, setSort] = useState<ProjectArticleSortOption>("recentlyEdited");
  const [layout, setLayout] = useState<ProjectLayout>("list");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  const projectQuery = useQuery({
    queryKey: getProjectQueryKey(numericId ?? 0),
    queryFn: () => getApiContentlyProjectsId(numericId!),
    enabled: numericId !== null,
  });

  const articlesQuery = useQuery({
    queryKey: getProjectArticlesQueryKey(numericId ?? 0),
    queryFn: () => getApiContentlyProjectsIdArticles(numericId!),
    enabled: numericId !== null,
  });

  const project = projectQuery.data?.data
    ? toProjectInfo(projectQuery.data.data)
    : null;

  const projectArticles = useMemo(
    () => (articlesQuery.data?.data ?? []).map(toProjectArticle),
    [articlesQuery.data],
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

  const isNotFound =
    numericId === null ||
    (projectQuery.isError &&
      projectQuery.error instanceof ApiClientError &&
      projectQuery.error.mapped.status === 404);

  if (isNotFound) {
    return (
      <PanelPageLayout className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">{t("notFoundTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("notFoundDescription", { id: projectId })}
        </p>
      </PanelPageLayout>
    );
  }

  if (projectQuery.isLoading) {
    return (
      <PanelPageLayout>
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </PanelPageLayout>
    );
  }

  if (projectQuery.isError || !project) {
    return (
      <PanelPageLayout>
        <p className="text-sm text-destructive" role="alert">
          {projectQuery.error instanceof ApiClientError
            ? projectQuery.error.mapped.message
            : t("error")}
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

      {articlesQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">{t("loadingArticles")}</p>
      ) : null}

      {articlesQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {articlesQuery.error instanceof ApiClientError
            ? articlesQuery.error.mapped.message
            : t("articlesError")}
        </p>
      ) : null}

      {articlesQuery.isSuccess && groups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("emptyDescription")}
          </p>
        </div>
      ) : null}

      {groups.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {groups.map((group) => (
            <ProjectDayGroup
              key={group.date}
              date={group.date}
              articles={group.articles}
              layout={layout}
              formatEditedLabel={(updatedAt) => formatEditedLabel(updatedAt, t)}
            />
          ))}
        </div>
      ) : null}
    </PanelPageLayout>
  );
}
