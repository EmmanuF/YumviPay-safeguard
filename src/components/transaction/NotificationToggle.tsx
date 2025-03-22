import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from '@/hooks/toast/use-toast';

interface NotificationToggleProps {
  isActive: boolean;
  onChange: (value: boolean) => void;
  entityId: string;
  entityType?: 'transaction' | 'payment' | 'user';
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({ 
  isActive, 
  onChange, 
  entityId,
  entityType = 'transaction' 
}) => {
  const { addNotification } = useNotifications();
  
  const handleToggleNotifications = (checked: boolean) => {
    onChange(checked);
    
    if (checked) {
      toast({
        title: "Notifications enabled",
        description: `You'll receive updates about this ${entityType}`,
      });
      
      // Demo: Show a notification immediately
      setTimeout(() => {
        addNotification({
          title: "Notifications Enabled",
          message: `You will now receive updates about this ${entityType} status.`,
          type: "info",
          transactionId: entityType === 'transaction' ? entityId : undefined
        });
      }, 1000);
    } else {
      toast({
        title: "Notifications disabled",
        description: `You won't receive updates about this ${entityType}`,
      });
    }
  };
  
  return (
    <div className="flex items-center">
      {isActive ? (
        <Bell className="h-5 w-5 text-primary-500 mr-3" />
      ) : (
        <BellOff className="h-5 w-5 text-gray-500 mr-3" />
      )}
      <div>
        <p className="text-sm font-medium">{entityType.charAt(0).toUpperCase() + entityType.slice(1)} Updates</p>
        <p className="text-xs text-gray-500">
          {isActive 
            ? `You'll get notified about status changes` 
            : `You won't get updates about this ${entityType}`}
        </p>
      </div>
    </div>
  );
};

export default NotificationToggle;
