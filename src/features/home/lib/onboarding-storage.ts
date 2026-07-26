import {
  ONBOARDING_STEPS,
  type OnboardingStepId,
} from "../data/onboarding-mock";

const STORAGE_KEY = "contently.home.onboarding";

export type OnboardingStorageState = {
  hidden: boolean;
  selectedId: OnboardingStepId;
  completed: Record<OnboardingStepId, boolean>;
};

function isStepId(value: unknown): value is OnboardingStepId {
  return (
    typeof value === "string" &&
    ONBOARDING_STEPS.some((step) => step.id === value)
  );
}

export function defaultOnboardingState(): OnboardingStorageState {
  const completed = Object.fromEntries(
    ONBOARDING_STEPS.map((step) => [step.id, step.completed]),
  ) as Record<OnboardingStepId, boolean>;

  const selectedId =
    ONBOARDING_STEPS.find((step) => !completed[step.id])?.id ??
    ONBOARDING_STEPS[0].id;

  return {
    hidden: false,
    selectedId,
    completed,
  };
}

export function readOnboardingStorage(): OnboardingStorageState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<OnboardingStorageState>;
    const defaults = defaultOnboardingState();

    const completed = { ...defaults.completed };
    if (parsed.completed && typeof parsed.completed === "object") {
      for (const step of ONBOARDING_STEPS) {
        if (typeof parsed.completed[step.id] === "boolean") {
          completed[step.id] = parsed.completed[step.id];
        }
      }
    }

    return {
      hidden: Boolean(parsed.hidden),
      selectedId: isStepId(parsed.selectedId)
        ? parsed.selectedId
        : defaults.selectedId,
      completed,
    };
  } catch {
    return null;
  }
}

export function writeOnboardingStorage(state: OnboardingStorageState): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / private-mode failures.
  }
}
