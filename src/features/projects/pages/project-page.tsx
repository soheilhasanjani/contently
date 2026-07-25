import { getTranslations, setRequestLocale } from "next-intl/server";

type ProjectPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Projects");

  return (
    <main className="flex flex-1 flex-col gap-2 p-6">
      <h1 className="text-xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">{t("projectId", { id })}</p>
    </main>
  );
}
