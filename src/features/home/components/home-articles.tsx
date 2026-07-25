"use client";

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
  MOCK_HOME_ARTICLES,
  type ArticleSortOption,
} from "@/features/home/data/articles-mock";
import { useTranslations } from "next-intl";
import { useState } from "react";

function formatEditedLabel(
  minutesAgo: number,
  t: ReturnType<typeof useTranslations<"Home.Articles">>,
): string {
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

function getSortedArticles(sort: ArticleSortOption) {
  const items = [...MOCK_HOME_ARTICLES];

  if (sort === "titleAsc") {
    return items.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sort === "recentlyEdited") {
    return items.sort((a, b) => a.editedMinutesAgo - b.editedMinutesAgo);
  }

  return items;
}

export function HomeArticles() {
  const t = useTranslations("Home.Articles");
  const [sort, setSort] = useState<ArticleSortOption>("lastViewedByMe");
  const articles = getSortedArticles(sort);

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
            if (
              ARTICLE_SORT_OPTIONS.includes(value as ArticleSortOption)
            ) {
              setSort(value as ArticleSortOption);
            }
          }}
          aria-label={t("sortLabel")}
        >
          <SelectTrigger size="sm" className="border-0 bg-transparent px-1 shadow-none dark:bg-transparent">
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            status={article.status}
            lastEditedLabel={formatEditedLabel(article.editedMinutesAgo, t)}
            authorName={article.authorName}
            authorImageUrl={article.authorImageUrl}
          />
        ))}
      </div>
    </section>
  );
}
