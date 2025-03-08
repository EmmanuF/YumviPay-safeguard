
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  const navigate = useNavigate();
  
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.transactionId) {
      navigate(`/transaction/${notification.transactionId}`);
      onClose();
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500"><CheckCheck className="w-4 h-4" /></div>;
      case 'error':
        return <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500"><X className="w-4 h-4" /></div>;
      case 'warning':
        return <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500"><Bell className="w-4 h-4" /></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><Bell className="w-4 h-4" /></div>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-16 z-50 w-80 rounded-xl bg-white shadow-lg overflow-hidden"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-medium text-lg">Notifications</h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-8"
                >
                  Mark all as read
                </Button>
              </div>
            </div>
            
            <ScrollArea className="max-h-96">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                        !notification.read && "bg-primary-50"
                      )}
                    >
                      <div className="flex gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className={cn(
                              "font-medium",
                              !notification.read && "text-primary-900"
                            )}>
                              {notification.title}
                            </h3>
                            {notification.transactionId && (
                              <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;
