import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Panel");

  return (
    <main className="flex flex-1 flex-col gap-2 p-6">
      <h1 className="text-xl font-semibold tracking-tight">{t("dashboardTitle")}</h1>
      <p className="text-sm text-muted-foreground">{t("dashboardSubtitle")}</p>
    </main>
  );
}
