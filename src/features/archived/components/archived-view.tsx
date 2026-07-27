"use client";

import {
  getApiContentlyArticles,
  postApiContentlyArticlesIdRestore,
} from "@/api/generated/endpoints/contently-articles/contently-articles";
import { getApiContentlyProjects } from "@/api/generated/endpoints/contently-projects/contently-projects";
import { PanelPageLayout } from "@/components/common/panel-page-layout";
import { toast } from "@/components/ui/toast";
import { ApiClientError } from "@/lib/api/error-mapper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fa";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
  ARCHIVED_ONLY_PARAM,
  getArchivedQueryKey,
  toArchivedArticle,
  toArchivedProject,
  type ArchiveSortOption,
  type ArchivedArticle,
  type ArchivedProject,
} from "../data/archived-mock";
import { ArchivedDayGroup } from "./archived-day-group";
import { ArchivedHeader } from "./archived-header";
import { ArchivedToolbar } from "./archived-toolbar";

type DayGroup = {
  date: string;
  articles: ArchivedArticle[];
};

type ArchivedQueryData = {
  articles: ArchivedArticle[];
  projects: ArchivedProject[];
};

function groupByArchivedDay(
  articles: ArchivedArticle[],
  sort: ArchiveSortOption,
): DayGroup[] {
  const byDate = new Map<string, ArchivedArticle[]>();

  for (const article of articles) {
    const list = byDate.get(article.archivedAt) ?? [];
    list.push(article);
    byDate.set(article.archivedAt, list);
  }

  const dates = [...byDate.keys()].sort((a, b) => {
    if (sort === "archivedOldest") {
      return dayjs(a).valueOf() - dayjs(b).valueOf();
    }
    return dayjs(b).valueOf() - dayjs(a).valueOf();
  });

  return dates.map((date) => {
    const dayArticles = [...(byDate.get(date) ?? [])];

    if (sort === "titleAsc") {
      dayArticles.sort((a, b) => a.title.localeCompare(b.title));
    }

    return { date, articles: dayArticles };
  });
}

export function ArchivedView() {
  const locale = useLocale();
  const t = useTranslations("Archived");
  const queryClient = useQueryClient();
  const [projectId, setProjectId] = useState("all");
  const [sort, setSort] = useState<ArchiveSortOption>("archivedNewest");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  const queryKey = useMemo(
    () => getArchivedQueryKey(projectId),
    [projectId],
  );

  const archivedQuery = useQuery({
    queryKey,
    queryFn: async (): Promise<ArchivedQueryData> => {
      const articleParams =
        projectId === "all"
          ? { archivedOnly: ARCHIVED_ONLY_PARAM }
          : {
              archivedOnly: ARCHIVED_ONLY_PARAM,
              projectId: Number(projectId),
            };

      const [articlesResponse, projectsResponse] = await Promise.all([
        getApiContentlyArticles(articleParams),
        getApiContentlyProjects(),
      ]);

      return {
        articles: articlesResponse.data.map(toArchivedArticle),
        projects: projectsResponse.data.map(toArchivedProject),
      };
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => postApiContentlyArticlesIdRestore(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<ArchivedQueryData>(queryKey);

      queryClient.setQueryData<ArchivedQueryData>(queryKey, (current) => {
        if (!current) return current;

        return {
          ...current,
          articles: current.articles.filter((article) => article.id !== id),
        };
      });

      return { previousData };
    },
    onError: (error, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      toast.add({
        title: t("restoreErrorTitle"),
        description:
          error instanceof ApiClientError
            ? error.mapped.message
            : t("restoreErrorDescription"),
        type: "error",
      });
    },
    onSuccess: () => {
      toast.add({
        title: t("restoreSuccessTitle"),
        description: t("restoreSuccessDescription"),
        type: "success",
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const projects = archivedQuery.data?.projects ?? [];
  const articles = archivedQuery.data?.articles ?? [];

  const projectsById = useMemo(
    () => new Map(projects.map((project) => [project.id, project])),
    [projects],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return articles;

    return articles.filter((article) => {
      const projectName =
        projectsById.get(article.projectId)?.name.toLowerCase() ?? "";
      return (
        article.title.toLowerCase().includes(query) ||
        projectName.includes(query)
      );
    });
  }, [articles, projectsById, search]);

  const groups = useMemo(
    () => groupByArchivedDay(filtered, sort),
    [filtered, sort],
  );

  return (
    <PanelPageLayout className="space-y-6 pt-0">
      <div className="sticky top-16 z-20 -mx-6 space-y-4 bg-background px-6 pt-6 pb-4">
        <ArchivedHeader />
        <ArchivedToolbar
          projects={projects}
          projectId={projectId}
          onProjectChange={setProjectId}
          sort={sort}
          onSortChange={setSort}
          search={search}
          onSearchChange={setSearch}
          resultCount={filtered.length}
        />
      </div>

      {archivedQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : null}

      {archivedQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {archivedQuery.error instanceof ApiClientError
            ? archivedQuery.error.mapped.message
            : t("error")}
        </p>
      ) : null}

      {!archivedQuery.isLoading &&
      !archivedQuery.isError &&
      groups.length === 0 ? (
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
            <ArchivedDayGroup
              key={group.date}
              date={group.date}
              articles={group.articles}
              projectsById={projectsById}
              restoringId={
                restoreMutation.isPending
                  ? (restoreMutation.variables ?? null)
                  : null
              }
              onRestore={(id) => restoreMutation.mutate(id)}
            />
          ))}
        </div>
      ) : null}
    </PanelPageLayout>
  );
}
