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
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <HomeWelcome />
        <HomeOnboarding />
        <HomeQuickActions />
        <HomeArticles />
      </div>
    </main>
  );
}
