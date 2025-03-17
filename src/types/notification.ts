
/**
 * Interface defining the notification settings for a user
 */
export interface NotificationSettings {
  transactions: boolean;
  marketing: boolean;
  updates: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
}
