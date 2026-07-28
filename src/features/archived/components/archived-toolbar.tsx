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
  ARCHIVE_SORT_OPTIONS,
  type ArchiveSortOption,
  type ArchivedProject,
} from "../data/archived-mock";

type ArchivedToolbarProps = {
  projects: ArchivedProject[];
  projectId: string;
  onProjectChange: (projectId: string) => void;
  sort: ArchiveSortOption;
  onSortChange: (sort: ArchiveSortOption) => void;
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
};

export function ArchivedToolbar({
  projects,
  projectId,
  onProjectChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
  resultCount,
}: ArchivedToolbarProps) {
  const t = useTranslations("Archived");
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
          value={projectId}
          onValueChange={(value) => {
            if (value) onProjectChange(value);
          }}
        >
          <SelectTrigger size="sm" aria-label={t("projectFilter")}>
            <SelectValue>
              {projectId === "all"
                ? t("allProjects")
                : (projects.find((p) => p.id === projectId)?.name ??
                  t("allProjects"))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all">{t("allProjects")}</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(value) => {
            if (!value) return;
            if (
              ARCHIVE_SORT_OPTIONS.includes(value as ArchiveSortOption)
            ) {
              onSortChange(value as ArchiveSortOption);
            }
          }}
        >
          <SelectTrigger size="sm" aria-label={t("sortLabel")}>
            <SelectValue>{t(`sort.${sort}`)}</SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            {ARCHIVE_SORT_OPTIONS.map((option) => (
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
