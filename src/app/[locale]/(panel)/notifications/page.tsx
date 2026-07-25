import { setRequestLocale } from "next-intl/server";
import { NotificationsPage } from "@/features/notifications/pages/notifications-page";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NotificationsPage params={params} />;
}
