import dayjs from "dayjs";

export const NOTIFICATION_TYPES = [
  "review",
  "comment",
  "mention",
  "system",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_STATUS_FILTERS = ["all", "unread", "read"] as const;

export type NotificationStatusFilter =
  (typeof NOTIFICATION_STATUS_FILTERS)[number];

export const NOTIFICATION_SORT_OPTIONS = ["newest", "oldest"] as const;

export type NotificationSortOption =
  (typeof NOTIFICATION_SORT_OPTIONS)[number];

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  /** YYYY-MM-DD */
  createdAt: string;
  read: boolean;
};

function daysAgo(n: number): string {
  return dayjs().subtract(n, "day").format("YYYY-MM-DD");
}

/** Static notifications until a notifications API exists. */
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    type: "review",
    title: "Review requested",
    body: "Sara Ahmadi asked you to review “How AI is reshaping editorial calendars”.",
    createdAt: daysAgo(0),
    read: false,
  },
  {
    id: "n-2",
    type: "comment",
    title: "New comment",
    body: "Alex Morgan left a comment on “Finding content gaps competitors miss”.",
    createdAt: daysAgo(0),
    read: false,
  },
  {
    id: "n-3",
    type: "mention",
    title: "You were mentioned",
    body: "Neda Karimi mentioned you in “Topic clusters that convert readers”.",
    createdAt: daysAgo(0),
    read: true,
  },
  {
    id: "n-4",
    type: "system",
    title: "Publishing scheduled",
    body: "“From brief to draft in under an hour” is scheduled for tomorrow afternoon.",
    createdAt: daysAgo(1),
    read: false,
  },
  {
    id: "n-5",
    type: "review",
    title: "Article approved",
    body: "“A practical guide to expert review loops” was approved by Soheil Hasanjani.",
    createdAt: daysAgo(1),
    read: true,
  },
  {
    id: "n-6",
    type: "comment",
    title: "Reply to your comment",
    body: "Sara Ahmadi replied to your note on “Publishing cadence for growing teams”.",
    createdAt: daysAgo(3),
    read: true,
  },
  {
    id: "n-7",
    type: "system",
    title: "Project updated",
    body: "SEO Lab project settings were updated by Alex Morgan.",
    createdAt: daysAgo(3),
    read: true,
  },
  {
    id: "n-8",
    type: "mention",
    title: "You were mentioned",
    body: "Soheil Hasanjani mentioned you in the Contently Blog standup notes.",
    createdAt: daysAgo(7),
    read: true,
  },
];
