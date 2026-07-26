"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  type NotificationPreferences,
} from "../data/settings-mock";
import { SettingsSection } from "./settings-section";

const PREFERENCE_KEYS = [
  "emailDigest",
  "articleUpdates",
  "projectInvites",
  "productNews",
] as const satisfies ReadonlyArray<keyof NotificationPreferences>;

export function SettingsNotificationsSection() {
  const t = useTranslations("Settings.Notifications");
  const [prefs, setPrefs] = useState(DEFAULT_NOTIFICATION_PREFERENCES);

  function updatePref(key: keyof NotificationPreferences, checked: boolean) {
    setPrefs((prev) => {
      const next = { ...prev, [key]: checked };
      // Local-only until a preferences API exists.
      toast.add({
        title: t("savedTitle"),
        description: t("savedDescription"),
        type: "success",
      });
      return next;
    });
  }

  return (
    <SettingsSection
      id="notifications"
      title={t("title")}
      description={t("description")}
    >
      <ul className="max-w-lg divide-y divide-border rounded-lg border border-border">
        {PREFERENCE_KEYS.map((key) => (
          <li
            key={key}
            className="flex items-center justify-between gap-4 px-3 py-3"
          >
            <div className="min-w-0 space-y-0.5">
              <Label htmlFor={`pref-${key}`} className="cursor-pointer">
                {t(`items.${key}.label`)}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t(`items.${key}.description`)}
              </p>
            </div>
            <Switch
              id={`pref-${key}`}
              checked={prefs[key]}
              onCheckedChange={(checked) => updatePref(key, checked)}
            />
          </li>
        ))}
      </ul>
    </SettingsSection>
  );
}
