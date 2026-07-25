import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { LoginForm } from "../components/login-form";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Auth");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12">
      <div className="flex max-w-sm flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
