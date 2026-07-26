import { setRequestLocale } from "next-intl/server";
import { SettingsView } from "../components/settings-view";

type SettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SettingsView />;
}
