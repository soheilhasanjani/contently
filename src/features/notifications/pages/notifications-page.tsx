import { setRequestLocale } from "next-intl/server";
import { NotificationsView } from "../components/notifications-view";

type NotificationsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function NotificationsPage({ params }: NotificationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <NotificationsView />;
}
