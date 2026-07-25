export type PanelProject = {
  id: string;
  name: string;
  color: string;
};

/** Static demo projects until projects API exists. */
export const MOCK_PROJECTS: PanelProject[] = [
  { id: "1", name: "Launch Blog", color: "#0D9488" },
  { id: "2", name: "Product Updates", color: "#D97706" },
  { id: "3", name: "SEO Series", color: "#7C3AED" },
];

/** Static notification count until notifications API exists. */
export const MOCK_NOTIFICATION_COUNT = 3;
