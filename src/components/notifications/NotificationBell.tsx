
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationsPanel from './NotificationsPanel';
import { cn } from '@/lib/utils';

const NotificationBell: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { unreadCount } = useNotifications();
  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="relative h-9 w-9"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className={cn(
            "absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white"
          )}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      
      <NotificationsPanel 
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
};

export default NotificationBell;
