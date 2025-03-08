
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from '@/hooks/use-toast';

interface StatusUpdateBarProps {
  transactionId: string;
}

const StatusUpdateBar: React.FC<StatusUpdateBarProps> = ({ transactionId }) => {
  const [isNotifying, setIsNotifying] = React.useState(true);
  const { addNotification } = useNotifications();
  
  const handleToggleNotifications = (checked: boolean) => {
    setIsNotifying(checked);
    
    if (checked) {
      toast({
        title: "Notifications enabled",
        description: "You'll receive updates about this transaction",
      });
      
      // Demo: Show a notification immediately
      setTimeout(() => {
        addNotification({
          title: "Notifications Enabled",
          message: "You will now receive updates about this transaction status.",
          type: "info",
          transactionId
        });
      }, 1000);
    } else {
      toast({
        title: "Notifications disabled",
        description: "You won't receive updates about this transaction",
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-primary-50 p-4 rounded-lg flex items-center justify-between"
    >
      <div className="flex items-center">
        {isNotifying ? (
          <Bell className="h-5 w-5 text-primary-500 mr-3" />
        ) : (
          <BellOff className="h-5 w-5 text-gray-500 mr-3" />
        )}
        <div>
          <p className="text-sm font-medium">Transaction Updates</p>
          <p className="text-xs text-gray-500">
            {isNotifying 
              ? "You'll get notified about status changes" 
              : "You won't get updates about this transaction"}
          </p>
        </div>
      </div>
      <Switch 
        checked={isNotifying} 
        onCheckedChange={handleToggleNotifications} 
      />
    </motion.div>
  );
};

export default StatusUpdateBar;
