import { PanelPageLayout } from "@/components/common/panel-page-layout";
import { getTranslations, setRequestLocale } from "next-intl/server";

type ProjectPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Projects");

  return (
    <PanelPageLayout className="space-y-2">
      <h1 className="text-xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">{t("projectId", { id })}</p>
    </PanelPageLayout>
  );
}
