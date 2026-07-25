"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LocaleSwitcher } from "@/features/panel/components/locale-switcher";
import { ThemeSwitcher } from "@/features/panel/components/theme-switcher";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user-store";
import {
  Search01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
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
    <header className="flex h-14 shrink-0 items-center justify-end gap-2 border-b border-border px-4">
      <LocaleSwitcher />
      <ThemeSwitcher />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("search")}
      >
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
      </Button>

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
          <AvatarFallback>
            {user ? initials(user.name) : "?"}
          </AvatarFallback>
        </Avatar>
      </Link>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button type="button" size="sm">
        {t("upgradePlan")}
      </Button>
    </header>
  );
}
