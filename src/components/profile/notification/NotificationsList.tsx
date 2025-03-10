
import React from 'react';
import { Bell, Mail, MessageSquare, ShoppingBag, RefreshCcw } from 'lucide-react';
import NotificationTypeItem from './NotificationTypeItem';
import { NotificationSettings } from '@/hooks/useNotificationSettings';

// Helper function to get icon for notification type
export const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'transactions':
      return <Bell className="h-5 w-5 text-primary-500" />;
    case 'marketing':
      return <ShoppingBag className="h-5 w-5 text-primary-500" />;
    case 'updates':
      return <RefreshCcw className="h-5 w-5 text-primary-500" />;
    case 'email':
      return <Mail className="h-5 w-5 text-primary-500" />;
    case 'push':
      return <Bell className="h-5 w-5 text-primary-500" />;
    case 'sms':
      return <MessageSquare className="h-5 w-5 text-primary-500" />;
    default:
      return <Bell className="h-5 w-5 text-primary-500" />;
  }
};

interface NotificationsListProps {
  title: string;
  items: Array<{
    key: keyof NotificationSettings;
    label: string;
    description: string;
  }>;
  settings: NotificationSettings;
  isLoading: boolean;
  onSettingChange: (key: keyof NotificationSettings, checked: boolean) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  title,
  items,
  settings,
  isLoading,
  onSettingChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      
      {items.map(({ key, label, description }) => (
        <NotificationTypeItem
          key={key}
          id={`notification-${key}`}
          icon={getNotificationIcon(key)}
          label={label}
          description={description}
          checked={settings[key]}
          onChange={(checked) => onSettingChange(key, checked)}
          disabled={isLoading}
        />
      ))}
    </div>
  );
};

export default NotificationsList;
