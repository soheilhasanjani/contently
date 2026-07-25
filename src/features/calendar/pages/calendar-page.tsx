import { getTranslations, setRequestLocale } from "next-intl/server";

type CalendarPageProps = {
  params: Promise<{ locale: string }>;
};

export async function CalendarPage({ params }: CalendarPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Calendar");

  return (
    <main className="flex flex-1 flex-col gap-2">
      <h1 className="text-xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">{t("comingSoon")}</p>
    </main>
  );
}
