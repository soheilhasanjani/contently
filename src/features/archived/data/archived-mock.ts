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
  id: string;
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

export const MOCK_ARCHIVED_PROJECTS: ArchivedProject[] = [
  { id: "proj-1", name: "Contently Blog", color: "primary" },
  { id: "proj-2", name: "Growth Hub", color: "info" },
  { id: "proj-3", name: "SEO Lab", color: "success" },
  { id: "proj-4", name: "Brand Stories", color: "tertiary" },
];

function daysAgo(n: number): string {
  return dayjs().subtract(n, "day").format("YYYY-MM-DD");
}

/** Static archived articles until an archive API exists. */
export const MOCK_ARCHIVED_ARTICLES: ArchivedArticle[] = [
  {
    id: "arch-1",
    title: "How AI is reshaping editorial calendars",
    projectId: "proj-1",
    archivedAt: daysAgo(0),
  },
  {
    id: "arch-2",
    title: "Quarterly content retrospective notes",
    projectId: "proj-2",
    archivedAt: daysAgo(0),
  },
  {
    id: "arch-3",
    title: "Finding content gaps competitors miss",
    projectId: "proj-2",
    archivedAt: daysAgo(1),
  },
  {
    id: "arch-4",
    title: "Topic clusters that convert readers",
    projectId: "proj-3",
    archivedAt: daysAgo(1),
  },
  {
    id: "arch-5",
    title: "A practical guide to expert review loops",
    projectId: "proj-1",
    archivedAt: daysAgo(1),
  },
  {
    id: "arch-6",
    title: "From brief to draft in under an hour",
    projectId: "proj-4",
    archivedAt: daysAgo(3),
  },
  {
    id: "arch-7",
    title: "Publishing cadence for growing teams",
    projectId: "proj-3",
    archivedAt: daysAgo(3),
  },
  {
    id: "arch-8",
    title: "Internal style guide: headlines",
    projectId: "proj-1",
    archivedAt: daysAgo(7),
  },
  {
    id: "arch-9",
    title: "SEO checklist for product launches",
    projectId: "proj-3",
    archivedAt: daysAgo(7),
  },
  {
    id: "arch-10",
    title: "Brand voice examples from Q1",
    projectId: "proj-4",
    archivedAt: daysAgo(12),
  },
];
