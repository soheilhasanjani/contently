"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { clearAccessToken } from "@/lib/auth/cookie";
import { routes } from "@/lib/routes";
import { useUserStore } from "@/stores/user-store";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export function UnauthorizedPage() {
  const t = useTranslations("SystemPages");
  const router = useRouter();
  const clearUser = useUserStore((s) => s.clearUser);
  const queryClient = useQueryClient();

  function goToLogin() {
    clearAccessToken();
    clearUser();
    void queryClient.clear();
    router.replace(routes.auth.login());
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("unauthorizedTitle")}
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {t("unauthorizedDescription")}
      </p>
      <Button type="button" onClick={goToLogin}>
        {t("goToLogin")}
      </Button>
    </main>
  );
}
