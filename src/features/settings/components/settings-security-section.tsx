"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  passwordSchema,
  type PasswordFormValues,
} from "../schemas/password-schema";
import { SettingsSection } from "./settings-section";

export function SettingsSecuritySection() {
  const t = useTranslations("Settings.Security");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async () => {
    // Local-only until a change-password endpoint exists.
    await new Promise((resolve) => setTimeout(resolve, 300));
    reset();
    toast.add({
      title: t("savedTitle"),
      description: t("savedDescription"),
      type: "success",
    });
  });

  return (
    <SettingsSection
      id="security"
      title={t("title")}
      description={t("description")}
    >
      <form onSubmit={onSubmit} className="max-w-lg space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-current-password">
            {t("currentPassword")}
          </Label>
          <Input
            id="settings-current-password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.currentPassword)}
            disabled={isSubmitting}
            {...register("currentPassword")}
          />
          {errors.currentPassword ? (
            <p className="text-sm text-destructive">
              {t("currentPasswordRequired")}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-new-password">{t("newPassword")}</Label>
          <Input
            id="settings-new-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.newPassword)}
            disabled={isSubmitting}
            {...register("newPassword")}
          />
          {errors.newPassword ? (
            <p className="text-sm text-destructive">{t("newPasswordInvalid")}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-confirm-password">
            {t("confirmPassword")}
          </Label>
          <Input
            id="settings-confirm-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            disabled={isSubmitting}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message === "mismatch"
                ? t("passwordMismatch")
                : t("confirmPasswordRequired")}
            </p>
          ) : null}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("saving") : t("save")}
        </Button>
      </form>
    </SettingsSection>
  );
}
