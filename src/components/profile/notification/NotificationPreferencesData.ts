
import { NotificationSettings } from '@/hooks/useNotificationSettings';

export const notificationTypes = [
  { key: 'transactions' as keyof NotificationSettings, label: 'Transaction alerts', description: 'Get notified about your transaction status updates' },
  { key: 'marketing' as keyof NotificationSettings, label: 'Marketing emails', description: 'Receive promotional offers and discounts' },
  { key: 'updates' as keyof NotificationSettings, label: 'App updates', description: 'Get notified about new features and app updates' }
];

export const notificationChannels = [
  { key: 'email' as keyof NotificationSettings, label: 'Email notifications', description: 'Receive notifications via email' },
  { key: 'push' as keyof NotificationSettings, label: 'Push notifications', description: 'Receive notifications on your device' },
  { key: 'sms' as keyof NotificationSettings, label: 'SMS notifications', description: 'Receive notifications via text message' }
];
