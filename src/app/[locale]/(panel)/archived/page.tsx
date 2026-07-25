import { setRequestLocale } from "next-intl/server";
import { ArchivedPage } from "@/features/archived/pages/archived-page";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ArchivedPage params={params} />;
}
