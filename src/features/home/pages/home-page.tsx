import { PanelPageLayout } from "@/components/common/panel-page-layout";
import { setRequestLocale } from "next-intl/server";
import { HomeArticles } from "../components/home-articles";
import { HomeOnboarding } from "../components/home-onboarding";
import { HomeQuickActions } from "../components/home-quick-actions";
import { HomeWelcome } from "../components/home-welcome";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PanelPageLayout>
      <HomeWelcome />
      <HomeOnboarding />
      <HomeQuickActions />
      <HomeArticles />
    </PanelPageLayout>
  );
}
