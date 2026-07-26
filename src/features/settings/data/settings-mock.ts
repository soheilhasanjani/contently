export type NotificationPreferences = {
  emailDigest: boolean;
  articleUpdates: boolean;
  projectInvites: boolean;
  productNews: boolean;
};

/** Local defaults until a preferences API exists. */
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  emailDigest: true,
  articleUpdates: true,
  projectInvites: true,
  productNews: false,
};

/** Days until a deletion request becomes permanent. */
export const ACCOUNT_DELETION_GRACE_DAYS = 30;
