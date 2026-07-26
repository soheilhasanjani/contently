"use client";

import { PanelPageLayout } from "@/components/common/panel-page-layout";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fa";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
  MOCK_ARCHIVED_ARTICLES,
  MOCK_ARCHIVED_PROJECTS,
  type ArchiveSortOption,
  type ArchivedArticle,
} from "../data/archived-mock";
import { ArchivedDayGroup } from "./archived-day-group";
import { ArchivedHeader } from "./archived-header";
import { ArchivedToolbar } from "./archived-toolbar";

type DayGroup = {
  date: string;
  articles: ArchivedArticle[];
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
  const [articles, setArticles] = useState(MOCK_ARCHIVED_ARTICLES);
  const [projectId, setProjectId] = useState("all");
  const [sort, setSort] = useState<ArchiveSortOption>("archivedNewest");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  const projectsById = useMemo(
    () => new Map(MOCK_ARCHIVED_PROJECTS.map((p) => [p.id, p])),
    [],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      if (projectId !== "all" && article.projectId !== projectId) {
        return false;
      }
      if (!query) return true;
      const projectName =
        projectsById.get(article.projectId)?.name.toLowerCase() ?? "";
      return (
        article.title.toLowerCase().includes(query) ||
        projectName.includes(query)
      );
    });
  }, [articles, projectId, projectsById, search]);

  const groups = useMemo(
    () => groupByArchivedDay(filtered, sort),
    [filtered, sort],
  );

  function handleRemove(id: string) {
    setArticles((prev) => prev.filter((article) => article.id !== id));
  }

  return (
    <PanelPageLayout className="space-y-6 pt-0">
      <div className="sticky top-16 z-20 -mx-6 space-y-4 bg-background px-6 pt-6 pb-4">
        <ArchivedHeader />
        <ArchivedToolbar
          projects={MOCK_ARCHIVED_PROJECTS}
          projectId={projectId}
          onProjectChange={setProjectId}
          sort={sort}
          onSortChange={setSort}
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
            <ArchivedDayGroup
              key={group.date}
              date={group.date}
              articles={group.articles}
              projectsById={projectsById}
              onRestore={handleRemove}
              onDelete={handleRemove}
            />
          ))}
        </div>
      )}
    </PanelPageLayout>
  );
}
