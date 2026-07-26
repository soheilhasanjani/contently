import { setRequestLocale } from "next-intl/server";
import { CalendarView } from "../components/calendar-view";

type CalendarPageProps = {
  params: Promise<{ locale: string }>;
};

export async function CalendarPage({ params }: CalendarPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CalendarView />;
}
