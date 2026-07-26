"use client";

import { cn } from "@/lib/utils";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { SettingsSection } from "./settings-section";

const THEME_OPTIONS = ["light", "dark", "system"] as const;

type ThemeOption = (typeof THEME_OPTIONS)[number];

function isThemeOption(value: string): value is ThemeOption {
  return THEME_OPTIONS.includes(value as ThemeOption);
}

function subscribe() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

function ThemePreview({ option }: { option: ThemeOption }) {
  if (option === "light") {
    return (
      <div className="flex h-20 flex-col overflow-hidden rounded-md border border-border bg-white">
        <div className="flex h-5 items-center gap-1 border-b border-neutral-200 bg-neutral-50 px-2">
          <span className="size-1.5 rounded-full bg-neutral-300" />
          <span className="size-1.5 rounded-full bg-neutral-300" />
          <span className="size-1.5 rounded-full bg-neutral-300" />
        </div>
        <div className="flex flex-1 gap-1.5 p-2">
          <div className="w-4 rounded-sm bg-neutral-100" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="h-1.5 w-3/4 rounded-full bg-neutral-200" />
            <div className="h-1.5 w-1/2 rounded-full bg-neutral-100" />
            <div className="mt-auto h-4 rounded-sm bg-neutral-100" />
          </div>
        </div>
      </div>
    );
  }

  if (option === "dark") {
    return (
      <div className="flex h-20 flex-col overflow-hidden rounded-md border border-neutral-700 bg-neutral-950">
        <div className="flex h-5 items-center gap-1 border-b border-neutral-800 bg-neutral-900 px-2">
          <span className="size-1.5 rounded-full bg-neutral-600" />
          <span className="size-1.5 rounded-full bg-neutral-600" />
          <span className="size-1.5 rounded-full bg-neutral-600" />
        </div>
        <div className="flex flex-1 gap-1.5 p-2">
          <div className="w-4 rounded-sm bg-neutral-800" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="h-1.5 w-3/4 rounded-full bg-neutral-700" />
            <div className="h-1.5 w-1/2 rounded-full bg-neutral-800" />
            <div className="mt-auto h-4 rounded-sm bg-neutral-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-20 overflow-hidden rounded-md border border-border">
      <div className="flex w-1/2 flex-col bg-white">
        <div className="h-5 border-b border-neutral-200 bg-neutral-50" />
        <div className="flex flex-1 flex-col gap-1 p-1.5">
          <div className="h-1.5 w-full rounded-full bg-neutral-200" />
          <div className="h-1.5 w-2/3 rounded-full bg-neutral-100" />
          <div className="mt-auto h-3 rounded-sm bg-neutral-100" />
        </div>
      </div>
      <div className="flex w-1/2 flex-col bg-neutral-950">
        <div className="h-5 border-b border-neutral-800 bg-neutral-900" />
        <div className="flex flex-1 flex-col gap-1 p-1.5">
          <div className="h-1.5 w-full rounded-full bg-neutral-700" />
          <div className="h-1.5 w-2/3 rounded-full bg-neutral-800" />
          <div className="mt-auto h-3 rounded-sm bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

export function SettingsAppearanceSection() {
  const t = useTranslations("Settings.Appearance");
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  const value: ThemeOption =
    isClient && theme && isThemeOption(theme) ? theme : "system";

  return (
    <SettingsSection
      id="appearance"
      title={t("title")}
      description={t("description")}
    >
      <div
        role="radiogroup"
        aria-label={t("title")}
        className="grid max-w-xl grid-cols-3 gap-3"
      >
        {THEME_OPTIONS.map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!isClient}
              onClick={() => setTheme(option)}
              className={cn(
                "group relative flex flex-col gap-2.5 rounded-xl border p-2.5 text-start transition-colors outline-none",
                "focus-visible:ring-3 focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:opacity-50",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-foreground/20 hover:bg-muted/40",
              )}
            >
              <ThemePreview option={option} />

              <div className="flex items-center justify-between gap-2 px-0.5">
                <span className="text-sm font-medium text-foreground">
                  {t(`themes.${option}.label`)}
                </span>
                {selected ? (
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    strokeWidth={1.5}
                    className="size-4 shrink-0 text-primary"
                  />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </SettingsSection>
  );
}
