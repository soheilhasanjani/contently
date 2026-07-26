"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type PeriodSwitcherProps = {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  previousLabel: string;
  nextLabel: string;
  className?: string;
};

/** Bordered prev / period label / next control for date ranges. */
export function PeriodSwitcher({
  label,
  onPrevious,
  onNext,
  previousLabel,
  nextLabel,
  className,
}: PeriodSwitcherProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={onPrevious}
        aria-label={previousLabel}
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={2}
          className="rtl:rotate-180"
        />
      </Button>
      <div className="flex h-7 min-w-40 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-sm font-medium tracking-tight text-foreground">
        {label}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={onNext}
        aria-label={nextLabel}
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={2}
          className="rtl:rotate-180"
        />
      </Button>
    </div>
  );
}
