import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export const PROJECT_COLORS = [
  "primary",
  "info",
  "success",
  "warning",
  "tertiary",
] as const;

export type ProjectColor = (typeof PROJECT_COLORS)[number];

export const POST_TIME_SLOTS = ["morning", "afternoon", "evening"] as const;

export type PostTimeSlot = (typeof POST_TIME_SLOTS)[number];

export type CalendarProject = {
  id: string;
  name: string;
  color: ProjectColor;
};

export type CalendarArticle = {
  id: string;
  title: string;
  projectId: string;
  /** YYYY-MM-DD */
  date: string;
  timeSlot: PostTimeSlot;
  /** Display range, e.g. "1 - 3pm" */
  timeRange: string;
};

export type ExpectedResult = {
  impressionMin: number;
  impressionMax: number;
  engagementRate: number;
  conversionRate: number;
};

export const MOCK_CALENDAR_PROJECTS: CalendarProject[] = [
  { id: "proj-1", name: "Contently Blog", color: "primary" },
  { id: "proj-2", name: "Growth Hub", color: "info" },
  { id: "proj-3", name: "SEO Lab", color: "success" },
  { id: "proj-4", name: "Brand Stories", color: "tertiary" },
];

function weekDate(dayOffset: number): string {
  return dayjs().startOf("isoWeek").add(dayOffset, "day").format("YYYY-MM-DD");
}

/** Static suggestions until a calendar API exists. Dates are relative to the current ISO week. */
export const MOCK_CALENDAR_ARTICLES: CalendarArticle[] = [
  {
    id: "cal-1",
    title: "How AI is reshaping editorial calendars",
    projectId: "proj-1",
    date: weekDate(0),
    timeSlot: "afternoon",
    timeRange: "1 - 3pm",
  },
  {
    id: "cal-2",
    title: "Finding content gaps competitors miss",
    projectId: "proj-2",
    date: weekDate(0),
    timeSlot: "morning",
    timeRange: "9 - 11am",
  },
  {
    id: "cal-2b",
    title: "Weekly content standup notes",
    projectId: "proj-2",
    date: weekDate(0),
    timeSlot: "afternoon",
    timeRange: "2 - 3pm",
  },
  {
    id: "cal-3",
    title: "From brief to draft in under an hour",
    projectId: "proj-3",
    date: weekDate(1),
    timeSlot: "afternoon",
    timeRange: "2 - 4pm",
  },
  {
    id: "cal-4",
    title: "A practical guide to expert review loops",
    projectId: "proj-1",
    date: weekDate(2),
    timeSlot: "morning",
    timeRange: "8 - 10am",
  },
  {
    id: "cal-5",
    title: "Topic clusters that convert readers",
    projectId: "proj-4",
    date: weekDate(2),
    timeSlot: "evening",
    timeRange: "5 - 7pm",
  },
  {
    id: "cal-6",
    title: "Publishing cadence for growing teams",
    projectId: "proj-2",
    date: weekDate(3),
    timeSlot: "afternoon",
    timeRange: "1 - 3pm",
  },
  {
    id: "cal-7",
    title: "What your analytics miss about retention",
    projectId: "proj-3",
    date: weekDate(4),
    timeSlot: "morning",
    timeRange: "10am - 12pm",
  },
  {
    id: "cal-8",
    title: "Brief templates that unblock writers",
    projectId: "proj-1",
    date: weekDate(5),
    timeSlot: "afternoon",
    timeRange: "3 - 5pm",
  },
  {
    id: "cal-9",
    title: "Seasonal content planning checklist",
    projectId: "proj-4",
    date: weekDate(6),
    timeSlot: "evening",
    timeRange: "6 - 8pm",
  },
];

export const DEFAULT_EXPECTED_RESULT: ExpectedResult = {
  impressionMin: 12_000,
  impressionMax: 13_000,
  engagementRate: 40,
  conversionRate: 12.7,
};

export const PROJECT_COLOR_CLASSES: Record<
  ProjectColor,
  { box: string; text: string; group: string }
> = {
  primary: {
    box: "bg-primary text-primary-foreground",
    text: "text-primary",
    group: "border-primary/20 bg-primary/5",
  },
  info: {
    box: "bg-info text-info-foreground",
    text: "text-info-foreground",
    group: "border-info-foreground/20 bg-info/40",
  },
  success: {
    box: "bg-success text-success-foreground",
    text: "text-success-foreground",
    group: "border-success-foreground/20 bg-success/40",
  },
  warning: {
    box: "bg-warning text-warning-foreground",
    text: "text-warning-foreground",
    group: "border-warning-foreground/20 bg-warning/40",
  },
  tertiary: {
    box: "bg-tertiary text-tertiary-foreground",
    text: "text-tertiary-foreground",
    group: "border-tertiary-foreground/20 bg-tertiary/40",
  },
};
