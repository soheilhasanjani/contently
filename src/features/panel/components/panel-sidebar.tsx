"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
    <aside className="flex w-64 shrink-0 flex-col border-e border-border bg-background">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
            C
          </span>
          <span className="text-sm font-semibold tracking-tight">
            {t("brand")}
          </span>
        </div>
        <Separator />
        <p className="text-xs text-muted-foreground">{t("freePlan")}</p>
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
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

      <div className="mt-6 flex min-h-0 flex-1 flex-col gap-2 px-2 pb-4">
        <div className="flex items-center justify-between gap-2 px-2">
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
