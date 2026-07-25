"use client";

import { Button } from "@/components/ui/button";
import { PanelNavLink } from "@/features/panel/components/panel-nav-link";
import {
  MOCK_NOTIFICATION_COUNT,
  MOCK_PROJECTS,
} from "@/features/panel/data/panel-shell-mock";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import {
  Add01Icon,
  Archive02Icon,
  Calendar03Icon,
  Home01Icon,
  Notification03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";

export function PanelSidebar() {
  const t = useTranslations("PanelShell");

  return (
    <aside className="fixed bottom-0 start-0 top-16 z-30 flex w-64 flex-col bg-background">
      <nav className="mt-3 flex flex-col gap-0.5 px-4">
        <PanelNavLink
          href={routes.home()}
          label={t("home")}
          icon={Home01Icon}
        />
        <PanelNavLink
          href={routes.calendar()}
          label={t("contentCalendar")}
          icon={Calendar03Icon}
        />
        <PanelNavLink
          href={routes.archived()}
          label={t("archived")}
          icon={Archive02Icon}
        />
        <PanelNavLink
          href={routes.notifications()}
          label={t("notifications")}
          icon={Notification03Icon}
          badgeCount={MOCK_NOTIFICATION_COUNT}
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
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
          </Button>
        </div>

        <ul className="flex flex-col gap-0.5 overflow-y-auto">
          {MOCK_PROJECTS.map((project) => (
            <li key={project.id}>
              <Link
                href={routes.projects.id({ id: project.id })}
                className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
              >
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold text-white"
                  style={{ backgroundColor: project.color }}
                  aria-hidden
                >
                  {project.name.trim().charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 truncate text-start">{project.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
