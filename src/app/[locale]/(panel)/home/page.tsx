import { setRequestLocale } from "next-intl/server";
import { HomePage } from "@/features/home/pages/home-page";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomePage params={params} />;
}
