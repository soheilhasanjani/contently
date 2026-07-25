import { setRequestLocale } from "next-intl/server";
import { HomeOnboarding } from "../components/home-onboarding";
import { HomeWelcome } from "../components/home-welcome";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-1 flex-col gap-8 p-6">
      <HomeWelcome />
      <HomeOnboarding />
    </main>
  );
}
