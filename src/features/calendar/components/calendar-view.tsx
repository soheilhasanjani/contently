"use client";

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
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import "dayjs/locale/en";
import "dayjs/locale/fa";
import { useLocale } from "next-intl";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  DEFAULT_EXPECTED_RESULT,
  MOCK_CALENDAR_ARTICLES,
  MOCK_CALENDAR_PROJECTS,
  type CalendarArticle,
  type ExpectedResult,
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

export function CalendarView() {
  const locale = useLocale();
  const [weekStart, setWeekStart] = useState(() => dayjs().startOf("isoWeek"));
  const [articles, setArticles] = useState<CalendarArticle[]>(
    MOCK_CALENDAR_ARTICLES,
  );
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

  const projectsById = useMemo(
    () =>
      Object.fromEntries(
        MOCK_CALENDAR_PROJECTS.map((project) => [project.id, project]),
      ),
    [],
  );

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

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

    const targetDate = weekDates.includes(overId)
      ? overId
      : articles.find((article) => article.id === overId)?.date;

    if (!targetDate) return;

    setArticles((prev) =>
      prev.map((article) =>
        article.id === articleId && article.date !== targetDate
          ? { ...article, date: targetDate }
          : article,
      ),
    );
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
            projects={MOCK_CALENDAR_PROJECTS}
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
            "relative z-0 mt-4 w-full min-w-0 overflow-x-auto overscroll-x-contain select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
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
