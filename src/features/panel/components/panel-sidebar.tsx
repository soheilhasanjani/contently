"use client";

import { getApiContentlyNotifications } from "@/api/generated/endpoints/contently-notifications/contently-notifications";
import { getApiContentlyProjects } from "@/api/generated/endpoints/contently-projects/contently-projects";
import { Button } from "@/components/ui/button";
import { getNotificationsQueryKey } from "@/features/notifications/data/notifications-mock";
import { PanelNavLink } from "@/features/panel/components/panel-nav-link";
import {
  PROJECT_COLOR_CLASSES,
  toPanelProject,
} from "@/features/panel/data/panel-shell-mock";
import { getProjectsQueryKey } from "@/features/projects/data/project-mock";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { Icon } from "@/components/common/icon";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function PanelSidebar() {
  const t = useTranslations("PanelShell");

  const notificationsQuery = useQuery({
    queryKey: getNotificationsQueryKey("all"),
    queryFn: () => getApiContentlyNotifications(),
  });

  const projectsQuery = useQuery({
    queryKey: getProjectsQueryKey(),
    queryFn: () => getApiContentlyProjects(),
  });

  const notificationCount = notificationsQuery.data?.data.length ?? 0;
  const projects = useMemo(
    () => (projectsQuery.data?.data ?? []).map(toPanelProject),
    [projectsQuery.data],
  );

  return (
    <aside className="fixed bottom-0 start-0 top-16 z-30 flex w-64 flex-col bg-background">
      <nav className="mt-3 flex flex-col gap-0.5 px-4">
        <PanelNavLink
          href={routes.home()}
          label={t("home")}
          icon="home"
        />
        <PanelNavLink
          href={routes.calendar()}
          label={t("contentCalendar")}
          icon="calendar_month"
        />
        <PanelNavLink
          href={routes.archived()}
          label={t("archived")}
          icon="archive"
        />
        <PanelNavLink
          href={routes.notifications()}
          label={t("notifications")}
          icon="notifications"
          badgeCount={notificationCount > 0 ? notificationCount : undefined}
        />
      </nav>

      <div className="mt-6 flex min-h-0 flex-1 flex-col gap-2 px-4 pb-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground">
            {t("myProjects")}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={t("addProject")}
          >
            <Icon name="add" size={16} />
          </Button>
        </div>

        {projectsQuery.isLoading ? (
          <p className="px-2.5 text-xs text-muted-foreground">
            {t("projectsLoading")}
          </p>
        ) : null}

        {projectsQuery.isError ? (
          <p className="px-2.5 text-xs text-destructive" role="alert">
            {t("projectsError")}
          </p>
        ) : null}

        {projectsQuery.isSuccess && projects.length === 0 ? (
          <p className="px-2.5 text-xs text-muted-foreground">
            {t("projectsEmpty")}
          </p>
        ) : null}

        {projects.length > 0 ? (
          <ul className="flex flex-col gap-0.5 overflow-y-auto">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={routes.projects.id({ id: project.id })}
                  className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      PROJECT_COLOR_CLASSES[project.color],
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 truncate text-start">
                    {project.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </aside>
  );
}
