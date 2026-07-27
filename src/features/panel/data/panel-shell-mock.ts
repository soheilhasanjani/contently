export const PROJECT_COLORS = [
  "primary",
  "info",
  "success",
  "warning",
  "tertiary",
] as const;

export type ProjectColor = (typeof PROJECT_COLORS)[number];

export type PanelProject = {
  id: string;
  name: string;
  color: ProjectColor;
};

export const PROJECT_COLOR_CLASSES: Record<ProjectColor, string> = {
  primary: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  tertiary: "bg-tertiary",
};

export function getProjectColor(projectId: number): ProjectColor {
  return PROJECT_COLORS[projectId % PROJECT_COLORS.length] ?? "primary";
}

export function toPanelProject(project: {
  id: number;
  title: string;
}): PanelProject {
  return {
    id: String(project.id),
    name: project.title,
    color: getProjectColor(project.id),
  };
}
