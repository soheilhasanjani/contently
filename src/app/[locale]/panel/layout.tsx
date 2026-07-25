import { setRequestLocale } from "next-intl/server";

type PanelLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** Private panel shell — auth guard + /me store land in a later phase. */
export default async function PanelLayout({
  children,
  params,
}: PanelLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
}
