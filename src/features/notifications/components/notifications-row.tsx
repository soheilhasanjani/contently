"use client";

import {
  FileEditIcon,
  NewsIcon,
  Notification03Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import type {
  NotificationItem,
  NotificationType,
} from "../data/notifications-mock";

const TYPE_ICONS: Record<NotificationType, IconSvgElement> = {
  article_update: FileEditIcon,
  project_invite: UserAdd01Icon,
  product_news: NewsIcon,
  system: Notification03Icon,
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
        <HugeiconsIcon icon={icon} strokeWidth={2} className="size-3.5" />
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
