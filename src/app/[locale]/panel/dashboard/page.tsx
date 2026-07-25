import { setRequestLocale } from "next-intl/server";
import { DashboardPage } from "@/features/panel/pages/dashboard-page";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardPage params={params} />;
}
