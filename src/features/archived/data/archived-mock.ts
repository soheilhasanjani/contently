import type { ContentlyArticle } from "@/api/generated/models/contentlyArticle";
import type { ContentlyProject } from "@/api/generated/models/contentlyProject";
import { GetApiContentlyArticlesArchivedOnly } from "@/api/generated/models/getApiContentlyArticlesArchivedOnly";
import dayjs from "dayjs";

export const PROJECT_COLORS = [
  "primary",
  "info",
  "success",
  "warning",
  "tertiary",
] as const;

export type ProjectColor = (typeof PROJECT_COLORS)[number];

export type ArchivedProject = {
  id: string;
  name: string;
  color: ProjectColor;
};

export type ArchivedArticle = {
  id: number;
  title: string;
  projectId: string;
  /** YYYY-MM-DD */
  archivedAt: string;
};

export const ARCHIVE_SORT_OPTIONS = [
  "archivedNewest",
  "archivedOldest",
  "titleAsc",
] as const;

export type ArchiveSortOption = (typeof ARCHIVE_SORT_OPTIONS)[number];

export const PROJECT_COLOR_CLASSES: Record<
  ProjectColor,
  { box: string; text: string }
> = {
  primary: {
    box: "bg-primary text-primary-foreground",
    text: "text-primary",
  },
  info: {
    box: "bg-info text-info-foreground",
    text: "text-info-foreground",
  },
  success: {
    box: "bg-success text-success-foreground",
    text: "text-success-foreground",
  },
  warning: {
    box: "bg-warning text-warning-foreground",
    text: "text-warning-foreground",
  },
  tertiary: {
    box: "bg-tertiary text-tertiary-foreground",
    text: "text-tertiary-foreground",
  },
};

export function getProjectColor(projectId: number): ProjectColor {
  return PROJECT_COLORS[projectId % PROJECT_COLORS.length] ?? "primary";
}

export function getArchivedQueryKey(projectId: string) {
  return ["contently", "archived", projectId] as const;
}

export function toArchivedProject(project: ContentlyProject): ArchivedProject {
  return {
    id: String(project.id),
    name: project.title,
    color: getProjectColor(project.id),
  };
}

export function toArchivedArticle(article: ContentlyArticle): ArchivedArticle {
  return {
    id: article.id,
    title: article.name,
    projectId: String(article.projectId),
    archivedAt: dayjs(article.deletedAt ?? article.updatedAt).format(
      "YYYY-MM-DD",
    ),
  };
}

export const ARCHIVED_ONLY_PARAM = GetApiContentlyArticlesArchivedOnly.true;
