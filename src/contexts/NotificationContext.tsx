
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
  transactionId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Initialize with mock notifications for demo
  useEffect(() => {
    // Mock notifications for demonstration purposes
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Transaction Completed',
        message: 'Your transfer of $250 to John Doe was successful.',
        type: 'success',
        read: false,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        transactionId: 'tx_123456',
      },
      {
        id: '2',
        title: 'New Promotion',
        message: 'Send money to Ghana with 0% fees until September 30th.',
        type: 'info',
        read: false,
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
      },
    ];
    
    setNotifications(mockNotifications);
  }, []);
  
  const addNotification = (newNotification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...newNotification,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [notification, ...prev]);
    
    // Show toast for new notifications
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default',
    });
    
    return notification.id;
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
