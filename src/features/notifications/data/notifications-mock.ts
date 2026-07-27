import type { ContentlyNotification } from "@/api/generated/models/contentlyNotification";
import {
  ContentlyNotificationType,
  type ContentlyNotificationType as NotificationType,
} from "@/api/generated/models/contentlyNotificationType";
import dayjs from "dayjs";

export { ContentlyNotificationType };
export type { NotificationType };

export const NOTIFICATION_TYPES = Object.values(ContentlyNotificationType);

export const NOTIFICATION_TYPE_FILTERS = ["all", ...NOTIFICATION_TYPES] as const;

export type NotificationTypeFilter =
  (typeof NOTIFICATION_TYPE_FILTERS)[number];

export const NOTIFICATION_SORT_OPTIONS = ["newest", "oldest"] as const;

export type NotificationSortOption =
  (typeof NOTIFICATION_SORT_OPTIONS)[number];

export type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  /** YYYY-MM-DD */
  createdAt: string;
};

export function getNotificationsQueryKey(type: NotificationTypeFilter) {
  return ["contently", "notifications", type] as const;
}

export function toNotificationItem(
  notification: ContentlyNotification,
): NotificationItem {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.description,
    createdAt: dayjs(notification.createdAt).format("YYYY-MM-DD"),
  };
}
