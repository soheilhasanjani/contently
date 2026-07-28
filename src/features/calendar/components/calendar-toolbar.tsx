"use client";

import { PeriodSwitcher } from "@/components/common/period-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/icon";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type {
  CalendarProject,
  ExpectedResult,
  PostTimeSlot,
} from "../data/calendar-mock";
import { POST_TIME_SLOTS } from "../data/calendar-mock";

type CalendarToolbarProps = {
  weekStart: dayjs.Dayjs;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  projects: CalendarProject[];
  projectId: string;
  onProjectChange: (projectId: string) => void;
  postTime: string;
  onPostTimeChange: (postTime: string) => void;
  expectedResult: ExpectedResult;
  onExpectedResultChange: (value: ExpectedResult) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

function formatPeriodLabel(weekStart: dayjs.Dayjs, locale: string): string {
  const start = weekStart.locale(locale);
  const end = weekStart.add(6, "day").locale(locale);
  const sameMonth = start.month() === end.month() && start.year() === end.year();

  if (sameMonth) {
    return `${start.format("D")}–${end.format("D MMM YYYY")}`;
  }

  if (start.year() === end.year()) {
    return `${start.format("D MMM")} – ${end.format("D MMM YYYY")}`;
  }

  return `${start.format("D MMM YYYY")} – ${end.format("D MMM YYYY")}`;
}

function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(
    value,
  );
}

export function CalendarToolbar({
  weekStart,
  onPrevWeek,
  onNextWeek,
  projects,
  projectId,
  onProjectChange,
  postTime,
  onPostTimeChange,
  expectedResult,
  onExpectedResultChange,
  search,
  onSearchChange,
}: CalendarToolbarProps) {
  const t = useTranslations("Calendar");
  const locale = useLocale();
  const [searchOpen, setSearchOpen] = useState(false);
  const [expectedOpen, setExpectedOpen] = useState(false);
  const [draft, setDraft] = useState(expectedResult);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.focus();
    }
  }, [searchOpen]);

  function handleExpectedOpenChange(open: boolean) {
    setExpectedOpen(open);
    if (open) {
      setDraft(expectedResult);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <PeriodSwitcher
        label={formatPeriodLabel(weekStart, locale)}
        onPrevious={onPrevWeek}
        onNext={onNextWeek}
        previousLabel={t("periodPrev")}
        nextLabel={t("periodNext")}
      />

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
          value={postTime}
          onValueChange={(value) => {
            if (value) onPostTimeChange(value);
          }}
        >
          <SelectTrigger size="sm" aria-label={t("postTimeFilter")}>
            <SelectValue>
              {postTime === "all"
                ? t("allPostTimes")
                : t(`postTime.${postTime as PostTimeSlot}`)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="all">{t("allPostTimes")}</SelectItem>
            {POST_TIME_SLOTS.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {t(`postTime.${slot}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={expectedOpen} onOpenChange={handleExpectedOpenChange}>
          <DialogTrigger
            render={<Button type="button" variant="outline" size="sm" />}
          >
            <Icon name="center_focus_strong" size={16} />
            {t("expectedResult")}
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("expectedResultTitle")}</DialogTitle>
              <DialogDescription>
                {t("expectedResultDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="impression-min">{t("impressionMin")}</Label>
                <Input
                  id="impression-min"
                  type="number"
                  min={0}
                  value={draft.impressionMin}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      impressionMin: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="impression-max">{t("impressionMax")}</Label>
                <Input
                  id="impression-max"
                  type="number"
                  min={0}
                  value={draft.impressionMax}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      impressionMax: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="eng-rate">{t("engagementRate")}</Label>
                <Input
                  id="eng-rate"
                  type="number"
                  min={0}
                  step="0.1"
                  value={draft.engagementRate}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      engagementRate: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="conv-rate">{t("conversionRate")}</Label>
                <Input
                  id="conv-rate"
                  type="number"
                  min={0}
                  step="0.1"
                  value={draft.conversionRate}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      conversionRate: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => {
                  onExpectedResultChange(draft);
                  setExpectedOpen(false);
                }}
              >
                {t("apply")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Separator orientation="vertical" className="mx-1 hidden h-4 sm:block" />

        <div className="flex items-center gap-1.5">
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
    </div>
  );
}

type CalendarMetricsProps = {
  count: number;
  expectedResult: ExpectedResult;
  className?: string;
};

export function CalendarMetrics({
  count,
  expectedResult,
  className,
}: CalendarMetricsProps) {
  const t = useTranslations("Calendar");
  const locale = useLocale();

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        {t("showing", { count })}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {t("impressionBadge", {
            min: formatNumber(expectedResult.impressionMin, locale),
            max: formatNumber(expectedResult.impressionMax, locale),
          })}
        </Badge>
        <Badge variant="secondary">
          {t("engagementBadge", { rate: expectedResult.engagementRate })}
        </Badge>
        <Badge variant="secondary">
          {t("conversionBadge", { rate: expectedResult.conversionRate })}
        </Badge>
      </div>
    </div>
  );
}
