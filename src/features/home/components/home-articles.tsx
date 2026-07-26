"use client";

import { getApiContentlyArticleViews } from "@/api/generated/endpoints/contently-article-views/contently-article-views";
import { ArticleCard } from "@/components/common/article-card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ARTICLE_SORT_OPTIONS,
  ARTICLE_SORT_TO_API,
  type ArticleSortOption,
} from "@/features/home/data/article-sort";
import {
  getArticleAuthorName,
  toArticleStatus,
} from "@/lib/contently/article";
import { ApiClientError } from "@/lib/api/error-mapper";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useState } from "react";

function formatEditedLabel(
  updatedAt: string,
  t: ReturnType<typeof useTranslations<"Home.Articles">>,
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

export function HomeArticles() {
  const t = useTranslations("Home.Articles");
  const [sort, setSort] = useState<ArticleSortOption>("lastViewedByMe");

  const articlesQuery = useQuery({
    queryKey: ["contently", "article-views", sort],
    queryFn: () =>
      getApiContentlyArticleViews({ sort: ARTICLE_SORT_TO_API[sort] }),
  });

  const articles = articlesQuery.data?.data ?? [];

  return (
    <section className="flex flex-col gap-4" aria-labelledby="home-articles-title">
      <div className="flex items-center gap-3">
        <h2
          id="home-articles-title"
          className="shrink-0 text-sm font-semibold tracking-tight text-foreground"
        >
          {t("title")}
        </h2>
        <Separator orientation="vertical" className="h-4" />
        <Select
          value={sort}
          onValueChange={(value) => {
            if (!value) return;
            if (ARTICLE_SORT_OPTIONS.includes(value as ArticleSortOption)) {
              setSort(value as ArticleSortOption);
            }
          }}
          aria-label={t("sortLabel")}
        >
          <SelectTrigger
            size="sm"
            className="border-0 bg-transparent px-1 shadow-none dark:bg-transparent"
          >
            <SelectValue>{t(`sort.${sort}`)}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            {ARTICLE_SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`sort.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {articlesQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : null}

      {articlesQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {articlesQuery.error instanceof ApiClientError
            ? articlesQuery.error.mapped.message
            : t("error")}
        </p>
      ) : null}

      {articlesQuery.isSuccess && articles.length === 0 ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
          <p className="text-sm text-muted-foreground">{t("emptyDescription")}</p>
        </div>
      ) : null}

      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.name}
              status={toArticleStatus(article.status)}
              lastEditedLabel={formatEditedLabel(article.updatedAt, t)}
              authorName={getArticleAuthorName(article)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
