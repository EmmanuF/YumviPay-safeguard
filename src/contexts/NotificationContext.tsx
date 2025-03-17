
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

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
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addTransactionStatusUpdate: (transactionId: string, status: string, amount?: string, recipient?: string) => string;
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
    // Fix: Use the correct format for Sonner's toast API
    toast(notification.title, {
      description: notification.message,
      // Use the correct variant mapping for Sonner
      // Sonner doesn't have a direct "variant" option but we can customize it
      // via className or style based on the notification type
      className: notification.type === 'error' ? 'destructive' : 'default',
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
  
  // Helper function to generate transaction status notifications
  const addTransactionStatusUpdate = (transactionId: string, status: string, amount?: string, recipient?: string) => {
    let notification: Omit<Notification, 'id' | 'timestamp' | 'read'>;
    
    // Create notification based on status
    switch (status) {
      case 'completed':
        notification = {
          title: "Transaction Completed",
          message: amount && recipient 
            ? `Your transfer of $${amount} to ${recipient} was successful.` 
            : "Your transaction was completed successfully.",
          type: 'success',
          transactionId
        };
        break;
      
      case 'processing':
        notification = {
          title: "Transaction Processing",
          message: "Your transaction is being processed. We'll notify you when it's complete.",
          type: 'info',
          transactionId
        };
        break;
      
      case 'failed':
        notification = {
          title: "Transaction Failed",
          message: "Unfortunately, your transaction could not be completed. Please try again.",
          type: 'error',
          transactionId
        };
        break;
      
      case 'offline-pending':
        notification = {
          title: "Transaction Queued",
          message: "Your transaction has been queued and will be processed when you're back online.",
          type: 'warning',
          transactionId
        };
        break;
      
      default:
        notification = {
          title: "Transaction Update",
          message: `Your transaction status is now: ${status}`,
          type: 'info',
          transactionId
        };
    }
    
    return addNotification(notification);
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
        addTransactionStatusUpdate
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
