import { UnauthorizedPage } from "@/features/system/pages/unauthorized-page";
import { setRequestLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <UnauthorizedPage />;
}
