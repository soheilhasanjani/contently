import { setRequestLocale } from "next-intl/server";
import { ProjectPage } from "@/features/projects/pages/project-page";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectPage params={params} />;
}
