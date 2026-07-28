"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { Icon } from "@/components/common/icon";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ACCOUNT_DELETION_GRACE_DAYS } from "../data/settings-mock";
import { SettingsSection } from "./settings-section";

export function SettingsDeleteAccountSection() {
  const t = useTranslations("Settings.DeleteAccount");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setSubmitting(true);
    // Local-only until a delete-account endpoint exists.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setPending(true);
    setOpen(false);
    setSubmitting(false);
    toast.add({
      title: t("requestedTitle"),
      description: t("requestedDescription", {
        days: ACCOUNT_DELETION_GRACE_DAYS,
      }),
      type: "success",
    });
  }

  function handleCancelRequest() {
    setPending(false);
    toast.add({
      title: t("cancelledTitle"),
      description: t("cancelledDescription"),
      type: "success",
    });
  }

  return (
    <SettingsSection
      id="delete-account"
      title={t("title")}
      description={t("description")}
    >
      {pending ? (
        <div className="max-w-lg space-y-3">
          <Alert variant="destructive">
            <Icon name="warning" size={16} />
            <AlertTitle>{t("pendingTitle")}</AlertTitle>
            <AlertDescription>
              {t("pendingDescription", { days: ACCOUNT_DELETION_GRACE_DAYS })}
            </AlertDescription>
          </Alert>
          <Button type="button" variant="outline" onClick={handleCancelRequest}>
            {t("cancelRequest")}
          </Button>
        </div>
      ) : (
        <div className="max-w-lg space-y-3">
          <p className="text-sm text-muted-foreground">{t("warning")}</p>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setOpen(true)}
          >
            {t("requestButton")}
          </Button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("confirmTitle")}</DialogTitle>
            <DialogDescription>
              {t("confirmDescription", { days: ACCOUNT_DELETION_GRACE_DAYS })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              {t("confirmCancel")}
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={submitting}
              onClick={handleConfirm}
            >
              {submitting ? t("confirming") : t("confirmSubmit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsSection>
  );
}
