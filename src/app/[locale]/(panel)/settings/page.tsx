import { setRequestLocale } from "next-intl/server";
import { SettingsPage } from "@/features/settings/pages/settings-page";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SettingsPage params={params} />;
}
