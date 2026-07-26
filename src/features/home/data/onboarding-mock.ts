export type OnboardingStepId =
  | "createProject"
  | "findGap"
  | "generateArticle"
  | "reviewArticle";

export type OnboardingStep = {
  id: OnboardingStepId;
  /** Default completion seed; runtime progress lives in localStorage. */
  completed: boolean;
};

/** Onboarding step ids + default completion (persisted in localStorage). */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: "createProject", completed: true },
  { id: "findGap", completed: false },
  { id: "generateArticle", completed: false },
  { id: "reviewArticle", completed: false },
];
