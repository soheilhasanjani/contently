import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { getTranslations, setRequestLocale } from "next-intl/server";

type AccessDeniedPageProps = {
  params: Promise<{ locale: string }>;
};

export async function AccessDeniedPage({ params }: AccessDeniedPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("SystemPages");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("accessDeniedTitle")}
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {t("accessDeniedDescription")}
      </p>
      <Link
        href={routes.home()}
        className={cn(buttonVariants())}
      >
        {t("backToPanel")}
      </Link>
    </main>
  );
}
