import { ContentlyArticleViewSort } from "@/api/generated/models";

export const ARTICLE_SORT_OPTIONS = [
  "lastViewedByMe",
  "recentlyEdited",
  "titleAsc",
] as const;

export type ArticleSortOption = (typeof ARTICLE_SORT_OPTIONS)[number];

export const ARTICLE_SORT_TO_API: Record<
  ArticleSortOption,
  (typeof ContentlyArticleViewSort)[keyof typeof ContentlyArticleViewSort]
> = {
  lastViewedByMe: ContentlyArticleViewSort.last_viewed,
  recentlyEdited: ContentlyArticleViewSort.recent_edited,
  titleAsc: ContentlyArticleViewSort.name_asc,
};
