"use client";

import { PanelPageLayout } from "@/components/common/panel-page-layout";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fa";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
  MOCK_NOTIFICATIONS,
  type NotificationItem,
  type NotificationSortOption,
  type NotificationStatusFilter,
} from "../data/notifications-mock";
import { NotificationsDayGroup } from "./notifications-day-group";
import { NotificationsHeader } from "./notifications-header";
import { NotificationsToolbar } from "./notifications-toolbar";

type DayGroup = {
  date: string;
  notifications: NotificationItem[];
};

function groupByDay(
  items: NotificationItem[],
  sort: NotificationSortOption,
): DayGroup[] {
  const byDate = new Map<string, NotificationItem[]>();

  for (const item of items) {
    const list = byDate.get(item.createdAt) ?? [];
    list.push(item);
    byDate.set(item.createdAt, list);
  }

  const dates = [...byDate.keys()].sort((a, b) => {
    if (sort === "oldest") {
      return dayjs(a).valueOf() - dayjs(b).valueOf();
    }
    return dayjs(b).valueOf() - dayjs(a).valueOf();
  });

  return dates.map((date) => ({
    date,
    notifications: byDate.get(date) ?? [],
  }));
}

export function NotificationsView() {
  const locale = useLocale();
  const t = useTranslations("Notifications");
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const [status, setStatus] = useState<NotificationStatusFilter>("all");
  const [sort, setSort] = useState<NotificationSortOption>("newest");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  const unreadCount = useMemo(
    () => items.filter((item) => !item.read).length,
    [items],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      if (status === "unread" && item.read) return false;
      if (status === "read" && !item.read) return false;
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.body.toLowerCase().includes(query)
      );
    });
  }, [items, search, status]);

  const groups = useMemo(
    () => groupByDay(filtered, sort),
    [filtered, sort],
  );

  function handleToggleRead(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: !item.read } : item,
      ),
    );
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleMarkAllRead() {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  }

  return (
    <PanelPageLayout className="space-y-6 pt-0">
      <div className="sticky top-16 z-20 -mx-6 space-y-4 bg-background px-6 pt-6 pb-4">
        <NotificationsHeader />
        <NotificationsToolbar
          status={status}
          onStatusChange={setStatus}
          sort={sort}
          onSortChange={setSort}
          search={search}
          onSearchChange={setSearch}
          resultCount={filtered.length}
          unreadCount={unreadCount}
          onMarkAllRead={handleMarkAllRead}
        />
      </div>

      {groups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {groups.map((group) => (
            <NotificationsDayGroup
              key={group.date}
              date={group.date}
              notifications={group.notifications}
              onToggleRead={handleToggleRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </PanelPageLayout>
  );
}
