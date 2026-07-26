"use client";

import { Button } from "@/components/ui/button";
import {
  ONBOARDING_STEPS,
  type OnboardingStepId,
} from "@/features/home/data/onboarding-mock";
import {
  defaultOnboardingState,
  readOnboardingStorage,
  writeOnboardingStorage,
  type OnboardingStorageState,
} from "../lib/onboarding-storage";
import { cn } from "@/lib/utils";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

function nextIncompleteId(
  completed: Record<OnboardingStepId, boolean>,
): OnboardingStepId {
  return (
    ONBOARDING_STEPS.find((step) => !completed[step.id])?.id ??
    ONBOARDING_STEPS[0].id
  );
}

export function HomeOnboarding() {
  const t = useTranslations("Home.Onboarding");
  const [state, setState] = useState<OnboardingStorageState | null>(null);

  useEffect(() => {
    setState(readOnboardingStorage() ?? defaultOnboardingState());
  }, []);

  useEffect(() => {
    if (!state) return;
    writeOnboardingStorage(state);
  }, [state]);

  if (!state || state.hidden) return null;

  const selectedIndex = ONBOARDING_STEPS.findIndex(
    (step) => step.id === state.selectedId,
  );
  const selectedStep = ONBOARDING_STEPS[selectedIndex] ?? ONBOARDING_STEPS[0];
  const stepNumber = selectedIndex + 1;
  const selectedCompleted = state.completed[selectedStep.id];

  function update(patch: Partial<OnboardingStorageState>) {
    setState((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function completeSelectedStep() {
    setState((prev) => {
      if (!prev) return prev;
      const completed = { ...prev.completed, [prev.selectedId]: true };
      return {
        ...prev,
        completed,
        selectedId: nextIncompleteId(completed),
      };
    });
  }

  return (
    <section className="relative overflow-hidden rounded-xl border border-muted bg-muted">
      <Button
        type="button"
        variant="link"
        size="sm"
        className="absolute end-4 top-4 z-10 h-auto px-0 text-muted-foreground hover:text-muted-foreground/80 sm:end-5 sm:top-5"
        onClick={() => update({ hidden: true })}
      >
        {t("hide")}
      </Button>

      <div className="flex flex-col lg:flex-row">
        <ol className="flex w-full shrink-0 flex-col gap-1 bg-background p-3 lg:w-fit lg:rounded-s-xl lg:p-4">
          {ONBOARDING_STEPS.map((step, index) => {
            const selected = step.id === state.selectedId;
            const completed = state.completed[step.id];
            const title = t(`steps.${step.id}.navTitle`);

            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => update({ selectedId: step.id })}
                  aria-current={selected ? "step" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-start text-sm transition-colors",
                    selected
                      ? "bg-muted text-foreground"
                      : "bg-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                      completed
                        ? "border-primary bg-primary text-primary-foreground"
                        : selected
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground",
                    )}
                    aria-hidden
                  >
                    {completed ? (
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate font-medium",
                      completed && "text-muted-foreground line-through",
                    )}
                  >
                    {title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-5 sm:p-5">
          <div
            className="h-36 w-full shrink-0 rounded-lg bg-primary sm:h-auto sm:w-40 lg:w-48"
            aria-hidden
          />

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              {t(`steps.${selectedStep.id}.title`)}
            </h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              {t(`steps.${selectedStep.id}.description`)}
            </p>
            <div className="pt-1">
              <Button
                type="button"
                size="lg"
                disabled={selectedCompleted}
                onClick={completeSelectedStep}
              >
                {t(`steps.${selectedStep.id}.action`)}
              </Button>
            </div>
            <p className="sr-only">
              {t("stepProgress", {
                current: stepNumber,
                total: ONBOARDING_STEPS.length,
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
