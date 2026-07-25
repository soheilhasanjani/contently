"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchInput } from "@/components/common/search-input";
import { LocaleSwitcher } from "@/features/panel/components/locale-switcher";
import { ThemeSwitcher } from "@/features/panel/components/theme-switcher";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user-store";
import { Settings02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export function PanelTopBar() {
  const t = useTranslations("PanelShell");
  const user = useUserStore((s) => s.user);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center bg-background px-4">
      <div className="relative z-10 flex w-64 shrink-0 items-center gap-2.5 pe-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
          C
        </span>
        <span className="min-w-0 truncate text-sm font-semibold tracking-tight">
          {t("brand")}
        </span>
        <Badge variant="warning">{t("freePlan")}</Badge>
      </div>

      <div className="pointer-events-none absolute inset-x-0 flex justify-center px-4">
        <SearchInput
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
          containerClassName="pointer-events-auto w-full max-w-md"
        />
      </div>

      <div className="relative z-10 ms-auto flex shrink-0 items-center justify-end gap-2">
        <LocaleSwitcher />
        <ThemeSwitcher />

        <Link
          href={routes.settings()}
          aria-label={t("settings")}
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
        >
          <HugeiconsIcon icon={Settings02Icon} strokeWidth={2} />
        </Link>

        <Link
          href={routes.settings()}
          className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label={t("profile")}
        >
          <Avatar size="sm">
            <AvatarFallback>{user ? initials(user.name) : "?"}</AvatarFallback>
          </Avatar>
        </Link>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button type="button" size="sm">
          {t("upgradePlan")}
        </Button>
      </div>
    </header>
  );
}
