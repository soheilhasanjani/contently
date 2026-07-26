"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import type { NotificationItem } from "../data/notifications-mock";
import { NotificationsRow } from "./notifications-row";

type NotificationsDayGroupProps = {
  date: string;
  notifications: NotificationItem[];
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
};

function formatDayLabel(
  date: string,
  locale: string,
  t: ReturnType<typeof useTranslations<"Notifications">>,
): string {
  const day = dayjs(date).locale(locale);
  const today = dayjs().startOf("day");
  const target = day.startOf("day");
  const diff = today.diff(target, "day");

  if (diff === 0) return t("today");
  if (diff === 1) return t("yesterday");

  return day.format("D MMM YYYY");
}

export function NotificationsDayGroup({
  date,
  notifications,
  onToggleRead,
  onDelete,
}: NotificationsDayGroupProps) {
  const t = useTranslations("Notifications");
  const locale = useLocale();

  return (
    <section
      className="space-y-1.5 rounded-lg bg-muted px-3 pt-3 pb-1"
      aria-labelledby={`notifications-day-${date}`}
    >
      <header className="flex items-center justify-between gap-3">
        <h2
          id={`notifications-day-${date}`}
          className="flex min-w-0 items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        >
          <HugeiconsIcon
            icon={Calendar03Icon}
            strokeWidth={2}
            className="size-3.5 shrink-0"
          />
          <span className="truncate">{formatDayLabel(date, locale, t)}</span>
        </h2>
        <p className="shrink-0 text-xs text-muted-foreground">
          {t("itemCount", { count: notifications.length })}
        </p>
      </header>

      <ul className="-mx-2 divide-y divide-border overflow-hidden rounded-md bg-background">
        {notifications.map((notification) => (
          <NotificationsRow
            key={notification.id}
            notification={notification}
            onToggleRead={onToggleRead}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}
