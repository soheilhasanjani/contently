"use client";

import { PanelPageLayout } from "@/components/common/panel-page-layout";
import { Separator } from "@/components/ui/separator";
import { SettingsAppearanceSection } from "./settings-appearance-section";
import { SettingsDeleteAccountSection } from "./settings-delete-account-section";
import { SettingsHeader } from "./settings-header";
import { SettingsNotificationsSection } from "./settings-notifications-section";
import { SettingsProfileSection } from "./settings-profile-section";
import { SettingsSecuritySection } from "./settings-security-section";

export function SettingsView() {
  return (
    <PanelPageLayout className="space-y-8">
      <SettingsHeader />

      <div className="space-y-8">
        <SettingsProfileSection />
        <Separator />
        <SettingsAppearanceSection />
        <Separator />
        <SettingsSecuritySection />
        <Separator />
        <SettingsNotificationsSection />
        <Separator />
        <SettingsDeleteAccountSection />
      </div>
    </PanelPageLayout>
  );
}
