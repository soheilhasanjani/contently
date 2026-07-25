import { setRequestLocale } from "next-intl/server";
import { PanelSession } from "@/features/panel/components/panel-session";

type PanelLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PanelLayout({
  children,
  params,
}: PanelLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PanelSession>{children}</PanelSession>;
}
