"use client";

import { getApiContentlyNotifications } from "@/api/generated/endpoints/contently-notifications/contently-notifications";
import { PanelPageLayout } from "@/components/common/panel-page-layout";
import { ApiClientError } from "@/lib/api/error-mapper";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fa";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
  getNotificationsQueryKey,
  toNotificationItem,
  type NotificationItem,
  type NotificationSortOption,
  type NotificationTypeFilter,
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
  const [typeFilter, setTypeFilter] = useState<NotificationTypeFilter>("all");
  const [sort, setSort] = useState<NotificationSortOption>("newest");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  const notificationsQuery = useQuery({
    queryKey: getNotificationsQueryKey(typeFilter),
    queryFn: () =>
      getApiContentlyNotifications(
        typeFilter === "all" ? undefined : { type: typeFilter },
      ),
  });

  const items = useMemo(
    () => (notificationsQuery.data?.data ?? []).map(toNotificationItem),
    [notificationsQuery.data],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.body.toLowerCase().includes(query),
    );
  }, [items, search]);

  const groups = useMemo(
    () => groupByDay(filtered, sort),
    [filtered, sort],
  );

  return (
    <PanelPageLayout className="space-y-6 pt-0">
      <div className="sticky top-16 z-20 -mx-6 space-y-4 bg-background px-6 pt-6 pb-4">
        <NotificationsHeader />
        <NotificationsToolbar
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          sort={sort}
          onSortChange={setSort}
          search={search}
          onSearchChange={setSearch}
          resultCount={filtered.length}
        />
      </div>

      {notificationsQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : null}

      {notificationsQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {notificationsQuery.error instanceof ApiClientError
            ? notificationsQuery.error.mapped.message
            : t("error")}
        </p>
      ) : null}

      {!notificationsQuery.isLoading &&
      !notificationsQuery.isError &&
      groups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("emptyDescription")}
          </p>
        </div>
      ) : null}

      {groups.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {groups.map((group) => (
            <NotificationsDayGroup
              key={group.date}
              date={group.date}
              notifications={group.notifications}
            />
          ))}
        </div>
      ) : null}
    </PanelPageLayout>
  );
}
