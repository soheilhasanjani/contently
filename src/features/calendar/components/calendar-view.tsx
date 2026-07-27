"use client";

import { getApiContentlyArticles } from "@/api/generated/endpoints/contently-articles/contently-articles";
import {
  getApiContentlyCalendar,
  patchApiContentlyCalendarId,
  putApiContentlyCalendarReorder,
} from "@/api/generated/endpoints/contently-calendar/contently-calendar";
import { getApiContentlyProjects } from "@/api/generated/endpoints/contently-projects/contently-projects";
import type { ContentlyArticle } from "@/api/generated/models/contentlyArticle";
import type { ContentlyCalendarEntry } from "@/api/generated/models/contentlyCalendarEntry";
import type { ContentlyProject } from "@/api/generated/models/contentlyProject";
import { ApiClientError } from "@/lib/api/error-mapper";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/en";
import "dayjs/locale/fa";
import { useLocale, useTranslations } from "next-intl";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  DEFAULT_EXPECTED_RESULT,
  type CalendarArticle,
  type CalendarProject,
  type ExpectedResult,
  getCalendarTimeMeta,
  getProjectColor,
} from "../data/calendar-mock";
import { CalendarArticleCardContent } from "./calendar-article-card";
import { CalendarDayColumn } from "./calendar-day-column";
import { CalendarHeader } from "./calendar-header";
import { CalendarMetrics, CalendarToolbar } from "./calendar-toolbar";

dayjs.extend(isoWeek);

/** Aligns board start with `max-w-5xl` + `px-6` content. */
const BOARD_INLINE_START = "ps-[max(1.5rem,calc((100%-64rem)/2+1.5rem))] pe-6";

function getWeekDates(weekStart: dayjs.Dayjs): string[] {
  return Array.from({ length: 7 }, (_, index) =>
    weekStart.add(index, "day").format("YYYY-MM-DD"),
  );
}

type CalendarQueryData = {
  articles: CalendarArticle[];
  projects: CalendarProject[];
};

function getCalendarQueryKey(from: string, to: string) {
  return ["contently", "calendar", from, to] as const;
}

function normalizeCalendarData(
  entries: ContentlyCalendarEntry[],
  articles: ContentlyArticle[],
  projects: ContentlyProject[],
): CalendarQueryData {
  const articlesById = new Map(articles.map((article) => [article.id, article]));

  const normalizedProjects = projects.map((project) => ({
    id: String(project.id),
    name: project.title,
    color: getProjectColor(project.id),
  }));

  const normalizedArticles = entries
    .map((entry) => {
      const article = articlesById.get(entry.articleId);
      if (!article) return null;

      return {
        id: String(entry.id),
        entryId: entry.id,
        articleId: article.id,
        title: article.name,
        projectId: String(article.projectId),
        date: entry.date,
        order: entry.order,
        ...getCalendarTimeMeta(entry.order),
      } satisfies CalendarArticle;
    })
    .filter((article): article is CalendarArticle => article !== null)
    .sort((left, right) => {
      if (left.date !== right.date) {
        return left.date.localeCompare(right.date);
      }

      return left.order - right.order;
    });

  return {
    articles: normalizedArticles,
    projects: normalizedProjects,
  };
}

function resequenceDayArticles(articles: CalendarArticle[]) {
  return articles.map((article, index) => ({
    ...article,
    order: index,
    ...getCalendarTimeMeta(index),
  }));
}

function getUpdatedArticlesForDrop(
  articles: CalendarArticle[],
  activeId: string,
  overId: string,
  weekDates: string[],
) {
  const activeArticle = articles.find((article) => article.id === activeId);
  if (!activeArticle) return null;

  const targetDate = weekDates.includes(overId)
    ? overId
    : articles.find((article) => article.id === overId)?.date;

  if (!targetDate) return null;

  const sourceDate = activeArticle.date;
  const remainingArticles = articles.filter((article) => article.id !== activeId);
  const sourceDayArticles = remainingArticles.filter(
    (article) => article.date === sourceDate,
  );
  const targetDayArticles = remainingArticles.filter(
    (article) => article.date === targetDate,
  );

  const insertIndex =
    overId === targetDate
      ? targetDayArticles.length
      : Math.max(
          targetDayArticles.findIndex((article) => article.id === overId),
          0,
        );

  const nextTargetDayArticles = resequenceDayArticles([
    ...targetDayArticles.slice(0, insertIndex),
    { ...activeArticle, date: targetDate },
    ...targetDayArticles.slice(insertIndex),
  ]);

  const updatedArticles =
    sourceDate === targetDate
      ? [
          ...remainingArticles.filter((article) => article.date !== targetDate),
          ...nextTargetDayArticles,
        ]
      : [
          ...remainingArticles.filter(
            (article) =>
              article.date !== sourceDate && article.date !== targetDate,
          ),
          ...resequenceDayArticles(sourceDayArticles),
          ...nextTargetDayArticles,
        ];

  return {
    sourceDate,
    targetDate,
    updatedArticles: updatedArticles.sort((left, right) => {
      if (left.date !== right.date) {
        return left.date.localeCompare(right.date);
      }

      return left.order - right.order;
    }),
  };
}

export function CalendarView() {
  const locale = useLocale();
  const t = useTranslations("Calendar");
  const [weekStart, setWeekStart] = useState(() => dayjs().startOf("isoWeek"));
  const [projectId, setProjectId] = useState("all");
  const [postTime, setPostTime] = useState("all");
  const [search, setSearch] = useState("");
  const [expectedResult, setExpectedResult] = useState<ExpectedResult>(
    DEFAULT_EXPECTED_RESULT,
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<{
    pointerId: number;
    startX: number;
    scrollLeft: number;
  } | null>(null);

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);
  const queryClient = useQueryClient();
  const from = weekDates[0] ?? weekStart.format("YYYY-MM-DD");
  const to = weekDates.at(-1) ?? weekStart.add(6, "day").format("YYYY-MM-DD");
  const queryKey = useMemo(() => getCalendarQueryKey(from, to), [from, to]);

  const calendarQuery = useQuery({
    queryKey,
    queryFn: async (): Promise<CalendarQueryData> => {
      const [calendarResponse, articlesResponse, projectsResponse] = await Promise.all(
        [
          getApiContentlyCalendar({ from, to }),
          getApiContentlyArticles(),
          getApiContentlyProjects(),
        ],
      );

      return normalizeCalendarData(
        calendarResponse.data,
        articlesResponse.data,
        projectsResponse.data,
      );
    },
  });

  const projects = calendarQuery.data?.projects ?? [];
  const projectsById = useMemo(
    () => Object.fromEntries(projects.map((project) => [project.id, project])),
    [projects],
  );

  const articles = calendarQuery.data?.articles ?? [];

  const moveArticleMutation = useMutation({
    mutationFn: async ({
      entryId,
      sourceDate,
      targetDate,
      targetOrderedIds,
      sourceOrderedIds,
    }: {
      entryId: number;
      sourceDate: string;
      targetDate: string;
      targetOrderedIds: number[];
      sourceOrderedIds: number[];
      updatedArticles: CalendarArticle[];
    }) => {
      if (sourceDate !== targetDate) {
        await patchApiContentlyCalendarId(entryId, {
          date: targetDate,
          order: targetOrderedIds.indexOf(entryId),
        });
      }

      await putApiContentlyCalendarReorder({
        date: targetDate,
        orderedIds: targetOrderedIds,
      });

      if (sourceDate !== targetDate && sourceOrderedIds.length > 0) {
        await putApiContentlyCalendarReorder({
          date: sourceDate,
          orderedIds: sourceOrderedIds,
        });
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<CalendarQueryData>(queryKey);

      queryClient.setQueryData<CalendarQueryData>(queryKey, (current) => {
        if (!current) return current;

        return {
          ...current,
          articles: variables.updatedArticles,
        };
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const currentError = calendarQuery.error ?? moveArticleMutation.error;

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      if (projectId !== "all" && article.projectId !== projectId) {
        return false;
      }
      if (postTime !== "all" && article.timeSlot !== postTime) {
        return false;
      }
      if (query) {
        const projectName =
          projectsById[article.projectId]?.name.toLowerCase() ?? "";
        if (
          !article.title.toLowerCase().includes(query) &&
          !projectName.includes(query)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [articles, postTime, projectId, projectsById, search]);

  const weekArticles = useMemo(
    () =>
      filteredArticles.filter((article) => weekDates.includes(article.date)),
    [filteredArticles, weekDates],
  );

  const activeArticle = activeId
    ? articles.find((article) => article.id === activeId)
    : undefined;

  function handleBoardPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (activeId || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("[data-calendar-card]")) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    panRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
    };
    setIsPanning(true);
    scroller.setPointerCapture(event.pointerId);
  }

  function handleBoardPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const pan = panRef.current;
    const scroller = scrollerRef.current;
    if (!pan || !scroller || pan.pointerId !== event.pointerId) return;

    scroller.scrollLeft = pan.scrollLeft - (event.clientX - pan.startX);
  }

  function handleBoardPointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    const pan = panRef.current;
    const scroller = scrollerRef.current;
    if (!pan || pan.pointerId !== event.pointerId) return;

    panRef.current = null;
    setIsPanning(false);
    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const articleId = String(active.id);
    const overId = String(over.id);
    const dropResult = getUpdatedArticlesForDrop(articles, articleId, overId, weekDates);
    const movedArticle = articles.find((article) => article.id === articleId);

    if (!dropResult || !movedArticle) return;

    void moveArticleMutation.mutateAsync({
      entryId: movedArticle.entryId,
      sourceDate: dropResult.sourceDate,
      targetDate: dropResult.targetDate,
      targetOrderedIds: dropResult.updatedArticles
        .filter((article) => article.date === dropResult.targetDate)
        .sort((left, right) => left.order - right.order)
        .map((article) => article.entryId),
      sourceOrderedIds: dropResult.updatedArticles
        .filter((article) => article.date === dropResult.sourceDate)
        .sort((left, right) => left.order - right.order)
        .map((article) => article.entryId),
      updatedArticles: dropResult.updatedArticles,
    });
  }

  return (
    <div className="w-full min-w-0 pb-6">
      <div className="sticky top-16 z-30 w-full min-w-0 bg-background">
        <div className="mx-auto w-full max-w-5xl space-y-4 px-6 pt-6 pb-4">
          <CalendarHeader />

          <CalendarToolbar
            weekStart={weekStart}
            onPrevWeek={() => setWeekStart((prev) => prev.subtract(1, "week"))}
            onNextWeek={() => setWeekStart((prev) => prev.add(1, "week"))}
            projects={projects}
            projectId={projectId}
            onProjectChange={setProjectId}
            postTime={postTime}
            onPostTimeChange={setPostTime}
            expectedResult={expectedResult}
            onExpectedResultChange={setExpectedResult}
            search={search}
            onSearchChange={setSearch}
          />

          <CalendarMetrics
            count={weekArticles.length}
            expectedResult={expectedResult}
          />
        </div>
      </div>

      {calendarQuery.isLoading ? (
        <div className="mx-auto max-w-5xl px-6 pt-4">
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      ) : null}

      {calendarQuery.isError || moveArticleMutation.isError ? (
        <div className="mx-auto max-w-5xl px-6 pt-4">
          <p className="text-sm text-destructive" role="alert">
            {currentError instanceof ApiClientError
              ? currentError.mapped.message
              : t("error")}
          </p>
        </div>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div
          ref={scrollerRef}
          onPointerDown={handleBoardPointerDown}
          onPointerMove={handleBoardPointerMove}
          onPointerUp={handleBoardPointerEnd}
          onPointerCancel={handleBoardPointerEnd}
          className={cn(
            "relative z-0 mt-4 w-full min-w-0 overflow-x-auto overscroll-x-contain scrollbar-none select-none [&::-webkit-scrollbar]:hidden",
            BOARD_INLINE_START,
            isPanning ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          <div className="flex w-max items-start gap-3 pe-6">
            {weekDates.map((date) => (
              <CalendarDayColumn
                key={date}
                date={date}
                articles={weekArticles.filter(
                  (article) => article.date === date,
                )}
                projectsById={projectsById}
              />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeArticle ? (
            <div className="w-[calc(16rem-1.5rem+0.75rem)] cursor-grabbing shadow-md">
              <CalendarArticleCardContent
                article={activeArticle}
                project={projectsById[activeArticle.projectId]}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
