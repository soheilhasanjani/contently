import { setRequestLocale } from "next-intl/server";
import { ProjectView } from "../components/project-view";

type ProjectPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <ProjectView projectId={id} />;
}
