import { setRequestLocale } from "next-intl/server";
import { CalendarPage } from "@/features/calendar/pages/calendar-page";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CalendarPage params={params} />;
}
