"use client";

import { Button } from "@/components/ui/button";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const t = useTranslations("PanelShell");
  const { setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={t("toggleTheme")}
      onClick={() => {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "light" : "dark");
      }}
    >
      <HugeiconsIcon
        icon={Moon02Icon}
        strokeWidth={1.5}
        className="size-5 dark:hidden"
      />
      <HugeiconsIcon
        icon={Sun03Icon}
        strokeWidth={1.5}
        className="hidden size-5 dark:block"
      />
    </Button>
  );
}
