"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useUserStore } from "@/stores/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/profile-schema";
import { SettingsSection } from "./settings-section";

export function SettingsProfileSection() {
  const t = useTranslations("Settings.Profile");
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name,
      username: user.username,
      email: user.email,
    });
  }, [user, reset]);

  const onSubmit = handleSubmit(async (values) => {
    // Local-only until PATCH /me (or equivalent) exists.
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (user) {
      setUser({
        ...user,
        name: values.name,
        username: values.username,
        email: values.email,
      });
    }

    reset(values);
    toast.add({
      title: t("savedTitle"),
      description: t("savedDescription"),
      type: "success",
    });
  });

  return (
    <SettingsSection
      id="profile"
      title={t("title")}
      description={t("description")}
    >
      <form onSubmit={onSubmit} className="max-w-lg space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-name">{t("name")}</Label>
          <Input
            id="settings-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            disabled={isSubmitting}
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-sm text-destructive">{t("nameInvalid")}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-username">{t("username")}</Label>
          <Input
            id="settings-username"
            autoComplete="username"
            aria-invalid={Boolean(errors.username)}
            disabled={isSubmitting}
            {...register("username")}
          />
          {errors.username ? (
            <p className="text-sm text-destructive">{t("usernameInvalid")}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-email">{t("email")}</Label>
          <Input
            id="settings-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-destructive">{t("emailInvalid")}</p>
          ) : null}
        </div>

        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? t("saving") : t("save")}
        </Button>
      </form>
    </SettingsSection>
  );
}
