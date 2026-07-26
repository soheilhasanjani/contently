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
import { cn } from "@/lib/utils";
import {
  Cancel01Icon,
  GridViewIcon,
  ListViewIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  PROJECT_ARTICLE_SORT_OPTIONS,
  PROJECT_LAYOUTS,
  PROJECT_STATUS_FILTERS,
  type ProjectArticleSortOption,
  type ProjectLayout,
  type ProjectStatusFilter,
} from "../data/project-mock";

type ProjectToolbarProps = {
  status: ProjectStatusFilter;
  onStatusChange: (status: ProjectStatusFilter) => void;
  sort: ProjectArticleSortOption;
  onSortChange: (sort: ProjectArticleSortOption) => void;
  layout: ProjectLayout;
  onLayoutChange: (layout: ProjectLayout) => void;
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
};

export function ProjectToolbar({
  status,
  onStatusChange,
  sort,
  onSortChange,
  layout,
  onLayoutChange,
  search,
  onSearchChange,
  resultCount,
}: ProjectToolbarProps) {
  const t = useTranslations("Projects");
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
          value={status}
          onValueChange={(value) => {
            if (!value) return;
            if (
              PROJECT_STATUS_FILTERS.includes(value as ProjectStatusFilter)
            ) {
              onStatusChange(value as ProjectStatusFilter);
            }
          }}
        >
          <SelectTrigger size="sm" aria-label={t("statusFilter")}>
            <SelectValue>{t(`status.${status}`)}</SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            {PROJECT_STATUS_FILTERS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`status.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(value) => {
            if (!value) return;
            if (
              PROJECT_ARTICLE_SORT_OPTIONS.includes(
                value as ProjectArticleSortOption,
              )
            ) {
              onSortChange(value as ProjectArticleSortOption);
            }
          }}
        >
          <SelectTrigger size="sm" aria-label={t("sortLabel")}>
            <SelectValue>{t(`sort.${sort}`)}</SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            {PROJECT_ARTICLE_SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`sort.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          className="inline-flex items-center rounded-lg border border-border p-0.5"
          role="group"
          aria-label={t("layoutLabel")}
        >
          {PROJECT_LAYOUTS.map((option) => {
            const active = layout === option;
            return (
              <Button
                key={option}
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={t(`layout.${option}`)}
                aria-pressed={active}
                className={cn(active && "bg-muted")}
                onClick={() => onLayoutChange(option)}
              >
                <HugeiconsIcon
                  icon={option === "list" ? ListViewIcon : GridViewIcon}
                  strokeWidth={2}
                />
              </Button>
            );
          })}
        </div>

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
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
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
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          </Button>
        )}
      </div>
    </div>
  );
}
