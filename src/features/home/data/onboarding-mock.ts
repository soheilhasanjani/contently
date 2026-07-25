export type OnboardingStepId =
  | "createProject"
  | "findGap"
  | "generateArticle"
  | "reviewArticle";

export type OnboardingStep = {
  id: OnboardingStepId;
  /** Demo completion until onboarding API exists. */
  completed: boolean;
};

/** Static onboarding steps until an API drives progress. */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: "createProject", completed: true },
  { id: "findGap", completed: false },
  { id: "generateArticle", completed: false },
  { id: "reviewArticle", completed: false },
];
