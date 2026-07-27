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
  entryId: number;
  articleId: number;
  title: string;
  projectId: string;
  /** YYYY-MM-DD */
  date: string;
  timeSlot: PostTimeSlot;
  /** Display range, e.g. "1 - 3pm" */
  timeRange: string;
  order: number;
};

export type ExpectedResult = {
  impressionMin: number;
  impressionMax: number;
  engagementRate: number;
  conversionRate: number;
};

export const DEFAULT_EXPECTED_RESULT: ExpectedResult = {
  impressionMin: 12_000,
  impressionMax: 13_000,
  engagementRate: 40,
  conversionRate: 12.7,
};

export const PROJECT_COLOR_CLASSES: Record<ProjectColor, { box: string }> = {
  primary: { box: "bg-primary" },
  info: { box: "bg-info" },
  success: { box: "bg-success" },
  warning: { box: "bg-warning" },
  tertiary: { box: "bg-tertiary" },
};

const SLOT_TIME_RANGES: Record<PostTimeSlot, string> = {
  morning: "9 - 11am",
  afternoon: "1 - 3pm",
  evening: "5 - 7pm",
};

export function getProjectColor(projectId: number): ProjectColor {
  return PROJECT_COLORS[projectId % PROJECT_COLORS.length] ?? "primary";
}

export function getCalendarTimeMeta(order: number): {
  timeSlot: PostTimeSlot;
  timeRange: string;
} {
  const timeSlot = POST_TIME_SLOTS[order % POST_TIME_SLOTS.length] ?? "morning";

  return {
    timeSlot,
    timeRange: SLOT_TIME_RANGES[timeSlot],
  };
}
