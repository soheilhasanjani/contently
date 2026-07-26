import type { ArticleStatus } from "@/components/common/article-card";
import type { ContentlyArticleStatus } from "@/api/generated/models";

const STATUS_TO_UI: Record<ContentlyArticleStatus, ArticleStatus> = {
  waiting_review: "waitingReview",
  being_edited: "beingEdited",
  revision: "revision",
  approved: "approved",
};

/** Map API snake_case status → UI camelCase used by ArticleCard / i18n. */
export function toArticleStatus(status: ContentlyArticleStatus): ArticleStatus {
  return STATUS_TO_UI[status];
}

/**
 * Prefer nested `author.name` when the API adds it; otherwise `"-"`.
 * Generated ContentlyArticle currently only has `authorId`.
 */
export function getArticleAuthorName(article: unknown): string {
  if (!article || typeof article !== "object") return "-";
  const author = (article as { author?: unknown }).author;
  if (!author || typeof author !== "object") return "-";
  const name = (author as { name?: unknown }).name;
  return typeof name === "string" && name.trim() ? name.trim() : "-";
}
