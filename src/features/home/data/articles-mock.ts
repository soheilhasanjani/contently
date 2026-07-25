import type { ArticleStatus } from "@/components/common/article-card";

export type HomeArticle = {
  id: string;
  title: string;
  status: ArticleStatus;
  /** Minutes since last edit — demo until articles API exists. */
  editedMinutesAgo: number;
  authorName: string;
  authorImageUrl?: string | null;
};

/** Static articles until an articles API exists. */
export const MOCK_HOME_ARTICLES: HomeArticle[] = [
  {
    id: "1",
    title: "How AI is reshaping editorial calendars",
    status: "waitingReview",
    editedMinutesAgo: 20,
    authorName: "Soheil Hasanjani",
  },
  {
    id: "2",
    title: "Finding content gaps competitors miss",
    status: "beingEdited",
    editedMinutesAgo: 45,
    authorName: "Sara Ahmadi",
  },
  {
    id: "3",
    title: "From brief to draft in under an hour",
    status: "revision",
    editedMinutesAgo: 90,
    authorName: "Alex Morgan",
  },
  {
    id: "4",
    title: "A practical guide to expert review loops",
    status: "approved",
    editedMinutesAgo: 180,
    authorName: "Soheil Hasanjani",
  },
  {
    id: "5",
    title: "Topic clusters that convert readers",
    status: "beingEdited",
    editedMinutesAgo: 240,
    authorName: "Neda Karimi",
  },
  {
    id: "6",
    title: "Publishing cadence for growing teams",
    status: "waitingReview",
    editedMinutesAgo: 400,
    authorName: "Alex Morgan",
  },
];

export const ARTICLE_SORT_OPTIONS = [
  "lastViewedByMe",
  "recentlyEdited",
  "titleAsc",
] as const;

export type ArticleSortOption = (typeof ARTICLE_SORT_OPTIONS)[number];
