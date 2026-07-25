import { getTranslations, setRequestLocale } from "next-intl/server";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("HomePage");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t("description")}
      </p>
    </main>
  );
}
