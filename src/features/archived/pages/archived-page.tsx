import { setRequestLocale } from "next-intl/server";
import { ArchivedView } from "../components/archived-view";

type ArchivedPageProps = {
  params: Promise<{ locale: string }>;
};

export async function ArchivedPage({ params }: ArchivedPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ArchivedView />;
}
