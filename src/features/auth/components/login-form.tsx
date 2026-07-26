"use client";

import { postAuthLogin } from "@/api/generated/endpoints/auth/auth";
import { ProjectCode } from "@/api/generated/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { ApiClientError } from "@/lib/api/error-mapper";
import { setAccessToken } from "@/lib/auth/cookie";
import { resolveNextPath } from "@/lib/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  loginSchema,
  type LoginFormValues,
} from "../schemas/login-schema";

export function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const busy = isSubmitting || isPending;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result = await postAuthLogin({
        ...values,
        projectCode: ProjectCode.contently,
      });
      setAccessToken(result.data.token);

      const next = resolveNextPath(searchParams.get("next"));
      startTransition(() => {
        router.replace(next);
      });
    } catch (error) {
      if (error instanceof ApiClientError) {
        setFormError(error.mapped.message);
        return;
      }
      setFormError(t("loginFailed"));
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">{t("username")}</Label>
        <Input
          id="username"
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          disabled={busy}
          {...register("username")}
        />
        {errors.username ? (
          <p className="text-sm text-destructive">{t("usernameRequired")}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          disabled={busy}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{t("passwordRequired")}</p>
        ) : null}
      </div>

      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <Button type="submit" disabled={busy} className="w-full">
        {busy ? t("signingIn") : t("signIn")}
      </Button>
    </form>
  );
}
