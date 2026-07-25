import { AccessDeniedPage } from "@/features/system/pages/access-denied-page";
import { setRequestLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AccessDeniedPage params={params} />;
}
