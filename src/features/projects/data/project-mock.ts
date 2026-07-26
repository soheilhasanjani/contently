import type { ArticleStatus } from "@/components/common/article-card";
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
  /** Minutes since last edit — demo until articles API exists. */
  editedMinutesAgo: number;
  /** YYYY-MM-DD — day group key */
  editedAt: string;
  authorName: string;
  authorImageUrl?: string | null;
};

export const MOCK_PROJECT_INFO: Record<string, ProjectInfo> = {
  "1": {
    id: "1",
    name: "Launch Blog",
    description:
      "Articles and drafts for the product launch blog and announcement series.",
  },
  "2": {
    id: "2",
    name: "Product Updates",
    description:
      "Release notes, changelog posts, and feature announcement drafts.",
  },
  "3": {
    id: "3",
    name: "SEO Series",
    description:
      "Long-form SEO guides, topic clusters, and content-gap follow-ups.",
  },
};

function daysAgo(n: number): string {
  return dayjs().subtract(n, "day").format("YYYY-MM-DD");
}

/** Static project articles until an articles API exists. */
export const MOCK_PROJECT_ARTICLES: ProjectArticle[] = [
  {
    id: "p1-a1",
    projectId: "1",
    title: "How AI is reshaping editorial calendars",
    status: "waitingReview",
    editedMinutesAgo: 20,
    editedAt: daysAgo(0),
    authorName: "Soheil Hasanjani",
  },
  {
    id: "p1-a2",
    projectId: "1",
    title: "Launch week content checklist",
    status: "beingEdited",
    editedMinutesAgo: 55,
    editedAt: daysAgo(0),
    authorName: "Sara Ahmadi",
  },
  {
    id: "p1-a3",
    projectId: "1",
    title: "From brief to draft in under an hour",
    status: "revision",
    editedMinutesAgo: 180,
    editedAt: daysAgo(1),
    authorName: "Alex Morgan",
  },
  {
    id: "p1-a4",
    projectId: "1",
    title: "A practical guide to expert review loops",
    status: "approved",
    editedMinutesAgo: 400,
    editedAt: daysAgo(3),
    authorName: "Soheil Hasanjani",
  },
  {
    id: "p2-a1",
    projectId: "2",
    title: "Finding content gaps competitors miss",
    status: "beingEdited",
    editedMinutesAgo: 35,
    editedAt: daysAgo(0),
    authorName: "Sara Ahmadi",
  },
  {
    id: "p2-a2",
    projectId: "2",
    title: "March product update roundup",
    status: "waitingReview",
    editedMinutesAgo: 120,
    editedAt: daysAgo(1),
    authorName: "Neda Karimi",
  },
  {
    id: "p2-a3",
    projectId: "2",
    title: "Feature announcement: AI brief builder",
    status: "approved",
    editedMinutesAgo: 900,
    editedAt: daysAgo(7),
    authorName: "Alex Morgan",
  },
  {
    id: "p3-a1",
    projectId: "3",
    title: "Topic clusters that convert readers",
    status: "beingEdited",
    editedMinutesAgo: 70,
    editedAt: daysAgo(0),
    authorName: "Neda Karimi",
  },
  {
    id: "p3-a2",
    projectId: "3",
    title: "SEO checklist for product launches",
    status: "revision",
    editedMinutesAgo: 220,
    editedAt: daysAgo(1),
    authorName: "Soheil Hasanjani",
  },
  {
    id: "p3-a3",
    projectId: "3",
    title: "Publishing cadence for growing teams",
    status: "waitingReview",
    editedMinutesAgo: 500,
    editedAt: daysAgo(3),
    authorName: "Alex Morgan",
  },
  {
    id: "p3-a4",
    projectId: "3",
    title: "Internal style guide: headlines",
    status: "approved",
    editedMinutesAgo: 1400,
    editedAt: daysAgo(7),
    authorName: "Sara Ahmadi",
  },
];
