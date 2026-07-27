import type { ContentlyArticle } from "@/api/generated/models/contentlyArticle";
import type { ContentlyProject } from "@/api/generated/models/contentlyProject";
import type { ArticleStatus } from "@/components/common/article-card";
import {
  getArticleAuthorName,
  toArticleStatus,
} from "@/lib/contently/article";
import dayjs from "dayjs";

export const PROJECT_LAYOUTS = ["list", "grid"] as const;

export type ProjectLayout = (typeof PROJECT_LAYOUTS)[number];

export const PROJECT_ARTICLE_SORT_OPTIONS = [
  "recentlyEdited",
  "oldestEdited",
  "titleAsc",
] as const;

export type ProjectArticleSortOption =
  (typeof PROJECT_ARTICLE_SORT_OPTIONS)[number];

export const PROJECT_STATUS_FILTERS = [
  "all",
  "waitingReview",
  "beingEdited",
  "revision",
  "approved",
] as const;

export type ProjectStatusFilter = (typeof PROJECT_STATUS_FILTERS)[number];

export type ProjectInfo = {
  id: string;
  name: string;
  description: string;
};

export type ProjectArticle = {
  id: string;
  projectId: string;
  title: string;
  status: ArticleStatus;
  /** ISO timestamp from API `updatedAt`. */
  updatedAt: string;
  /** YYYY-MM-DD — day group key */
  editedAt: string;
  authorName: string;
  authorImageUrl?: string | null;
};

export function getProjectsQueryKey() {
  return ["contently", "projects"] as const;
}

export function getProjectQueryKey(id: number) {
  return ["contently", "projects", id] as const;
}

export function getProjectArticlesQueryKey(id: number) {
  return ["contently", "projects", id, "articles"] as const;
}

export function parseProjectId(projectId: string): number | null {
  const id = Number(projectId);
  if (!Number.isFinite(id) || id <= 0 || !Number.isInteger(id)) return null;
  return id;
}

export function toProjectInfo(project: ContentlyProject): ProjectInfo {
  return {
    id: String(project.id),
    name: project.title,
    description: project.description,
  };
}

export function toProjectArticle(article: ContentlyArticle): ProjectArticle {
  return {
    id: String(article.id),
    projectId: String(article.projectId),
    title: article.name,
    status: toArticleStatus(article.status),
    updatedAt: article.updatedAt,
    editedAt: dayjs(article.updatedAt).format("YYYY-MM-DD"),
    authorName: getArticleAuthorName(article),
  };
}
