"use client";

import { Icon, type IconName } from "@/components/common/icon";
import type {
  NotificationItem,
  NotificationType,
} from "../data/notifications-mock";

const TYPE_ICONS: Record<NotificationType, IconName> = {
  article_update: "edit_note",
  project_invite: "person_add",
  product_news: "newspaper",
  system: "notifications",
};

type NotificationsRowProps = {
  notification: NotificationItem;
};

export function NotificationsRow({ notification }: NotificationsRowProps) {
  const icon = TYPE_ICONS[notification.type];

  return (
    <li className="flex items-start gap-2.5 px-2.5 py-2">
      <span
        className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
        aria-hidden
      >
        <Icon name={icon} size={14} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {notification.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {notification.body}
        </p>
      </div>
    </li>
  );
}
