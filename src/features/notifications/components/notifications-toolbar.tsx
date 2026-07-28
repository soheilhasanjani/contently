"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@/components/common/icon";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  NOTIFICATION_SORT_OPTIONS,
  NOTIFICATION_TYPE_FILTERS,
  type NotificationSortOption,
  type NotificationTypeFilter,
} from "../data/notifications-mock";

type NotificationsToolbarProps = {
  typeFilter: NotificationTypeFilter;
  onTypeFilterChange: (type: NotificationTypeFilter) => void;
  sort: NotificationSortOption;
  onSortChange: (sort: NotificationSortOption) => void;
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
};

export function NotificationsToolbar({
  typeFilter,
  onTypeFilterChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
  resultCount,
}: NotificationsToolbarProps) {
  const t = useTranslations("Notifications");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.focus();
    }
  }, [searchOpen]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {t("showing", { count: resultCount })}
      </p>

      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <Select
          value={typeFilter}
          onValueChange={(value) => {
            if (!value) return;
            if (
              NOTIFICATION_TYPE_FILTERS.includes(
                value as NotificationTypeFilter,
              )
            ) {
              onTypeFilterChange(value as NotificationTypeFilter);
            }
          }}
        >
          <SelectTrigger size="sm" aria-label={t("typeFilter")}>
            <SelectValue>{t(`type.${typeFilter}`)}</SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            {NOTIFICATION_TYPE_FILTERS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`type.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(value) => {
            if (!value) return;
            if (
              NOTIFICATION_SORT_OPTIONS.includes(
                value as NotificationSortOption,
              )
            ) {
              onSortChange(value as NotificationSortOption);
            }
          }}
        >
          <SelectTrigger size="sm" aria-label={t("sortLabel")}>
            <SelectValue>{t(`sort.${sort}`)}</SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            {NOTIFICATION_SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`sort.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="mx-1 hidden h-4 sm:block" />

        {searchOpen ? (
          <div className="flex items-center gap-1">
            <Input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-7 w-44"
              aria-label={t("search")}
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={t("closeSearch")}
              onClick={() => {
                setSearchOpen(false);
                onSearchChange("");
              }}
            >
              <Icon name="close" size={16} />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t("search")}
            onClick={() => setSearchOpen(true)}
          >
            <Icon name="search" size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
