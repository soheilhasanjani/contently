import { setRequestLocale } from "next-intl/server";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

/** Placeholder until panel feature work starts. */
export async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Dashboard</p>
    </main>
  );
}
