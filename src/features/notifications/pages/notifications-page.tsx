import { PanelPageLayout } from "@/components/common/panel-page-layout";
import { getTranslations, setRequestLocale } from "next-intl/server";

type NotificationsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function NotificationsPage({ params }: NotificationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Notifications");

  return (
    <PanelPageLayout className="space-y-2">
      <h1 className="text-xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">{t("comingSoon")}</p>
    </PanelPageLayout>
  );
}
