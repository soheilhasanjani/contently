"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  CheckmarkCircle02Icon,
  Comment01Icon,
  Delete02Icon,
  Mail01Icon,
  Notification03Icon,
  Tick02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type {
  NotificationItem,
  NotificationType,
} from "../data/notifications-mock";

const TYPE_ICONS: Record<NotificationType, IconSvgElement> = {
  review: CheckmarkCircle02Icon,
  comment: Comment01Icon,
  mention: UserIcon,
  system: Notification03Icon,
};

type NotificationsRowProps = {
  notification: NotificationItem;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export function NotificationsRow({
  notification,
  onToggleRead,
  onDelete,
}: NotificationsRowProps) {
  const t = useTranslations("Notifications");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const icon = TYPE_ICONS[notification.type];

  return (
    <li className="flex items-start gap-2.5 px-2.5 py-2">
      <span
        className={cn(
          "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md",
          notification.read
            ? "bg-muted text-muted-foreground"
            : "bg-primary/10 text-primary",
        )}
        aria-hidden
      >
        <HugeiconsIcon icon={icon} strokeWidth={2} className="size-3.5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <p
            className={cn(
              "truncate text-sm text-foreground",
              !notification.read && "font-medium",
            )}
          >
            {notification.title}
          </p>
          {!notification.read ? (
            <span
              className="size-1.5 shrink-0 rounded-full bg-primary"
              aria-label={t("unread")}
            />
          ) : null}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {notification.body}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {!notification.read ? (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t("markRead")}
            onClick={() => onToggleRead(notification.id)}
          >
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t("markUnread")}
            onClick={() => onToggleRead(notification.id)}
          >
            <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />
          </Button>
        )}

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t("delete")}
            onClick={() => setDeleteOpen(true)}
          >
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          </Button>
          <DialogContent className="sm:max-w-md" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>{t("deleteTitle")}</DialogTitle>
              <DialogDescription>
                {t("deleteDescription", { title: notification.title })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteOpen(false)}
              >
                {t("deleteCancel")}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onDelete(notification.id);
                  setDeleteOpen(false);
                }}
              >
                {t("deleteConfirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </li>
  );
}
