"use client";

import { getAuthMe } from "@/api/generated/endpoints/auth/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ApiClientError } from "@/lib/api/error-mapper";
import { routes } from "@/lib/routes";
import { useUserStore } from "@/stores/user-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type PanelSessionProps = {
  children: React.ReactNode;
};

export function PanelSession({ children }: PanelSessionProps) {
  const t = useTranslations("Panel");
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);
  const logout = useUserStore((s) => s.logout);
  const user = useUserStore((s) => s.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => getAuthMe(),
    retry: false,
  });

  useEffect(() => {
    if (meQuery.data?.data) {
      setUser(meQuery.data.data);
    }
  }, [meQuery.data, setUser]);

  useEffect(() => {
    if (!meQuery.error) return;
    if (
      meQuery.error instanceof ApiClientError &&
      meQuery.error.mapped.isUnauthorized
    ) {
      clearUser();
    }
  }, [meQuery.error, clearUser]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout(queryClient);
      router.replace(routes.auth.login());
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (meQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">{t("loadingSession")}</p>
      </div>
    );
  }

  if (meQuery.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-sm text-destructive">{t("sessionError")}</p>
        <Button
          type="button"
          variant="outline"
          disabled={isLoggingOut}
          onClick={() => void handleLogout()}
        >
          {t("backToLogin")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-3">
        <p className="text-sm text-muted-foreground">
          {user ? t("signedInAs", { name: user.name }) : null}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isLoggingOut}
          onClick={() => void handleLogout()}
        >
          {t("logout")}
        </Button>
      </header>
      {children}
    </div>
  );
}
