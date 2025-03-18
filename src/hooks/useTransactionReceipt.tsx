
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  generateReceipt, 
  downloadReceiptAsHtml, 
  getReceiptByTransactionId,
  TransactionReceipt,
  sendReceiptByEmail
} from '@/services/receipt/receiptService';
import { notifyRecipient } from '@/services/notification/notificationService';
import { toast } from '@/hooks/use-toast';
import { Transaction } from '@/types/transaction';
import { useNotifications } from '@/contexts/NotificationContext';
import { NativeSharingService } from '@/services/sharing/nativeSharingService';
import { PushNotificationService } from '@/services/push/pushNotificationService';

// Utility function to safely parse a number
const safeParseNumber = (value: string | number | undefined): number => {
  if (value === undefined) return 0;
  if (typeof value === 'number') return value;
  return parseFloat(value) || 0;
};

export const useTransactionReceipt = (transaction: Transaction | null) => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'email' | 'sms' | null>(null);
  const [generatingReceipt, setGeneratingReceipt] = useState(false);

  // Effect to clear interval when component unmounts
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  // Load existing receipt if available
  useEffect(() => {
    if (transaction?.id) {
      const existingReceipt = getReceiptByTransactionId(transaction.id);
      if (existingReceipt) {
        setReceipt(existingReceipt);
      }
    }
  }, [transaction?.id]);

  const handleShareTransaction = async () => {
    if (!transaction) return;

    try {
      // Use our native sharing service
      const success = await NativeSharingService.shareTransactionReceipt({
        id: transaction.id,
        amount: transaction.amount,
        recipientName: transaction.recipientName,
        status: transaction.status
      });
      
      if (!success) {
        // Fallback if native sharing failed
        toast({
          title: "Share",
          description: "Transaction receipt link copied to clipboard!",
        });
      }
    } catch (error) {
      console.error('Error sharing transaction:', error);
      toast({
        title: "Share failed",
        description: "Could not share the transaction",
        variant: "destructive"
      });
    }
  };

  const handleDownloadReceipt = async () => {
    if (!transaction) return;
    
    setGeneratingReceipt(true);
    
    try {
      // Generate receipt if we don't have one
      let currentReceipt = receipt;
      if (!currentReceipt) {
        currentReceipt = await generateReceipt(transaction);
        setReceipt(currentReceipt);
      }
      
      // Download the receipt
      downloadReceiptAsHtml(currentReceipt);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast({
        title: "Error",
        description: "Could not download receipt",
        variant: "destructive",
      });
    } finally {
      setGeneratingReceipt(false);
    }
  };

  const handleSendAgain = () => {
    if (!transaction) return;
    
    navigate('/send', {
      state: {
        selectedRecipient: {
          id: transaction.recipientId,
          name: transaction.recipientName,
          contact: transaction.recipientContact,
          country: transaction.country,
          isFavorite: false
        }
      }
    });
  };
  
  const handleSendEmailReceipt = async () => {
    if (!transaction) return;
    
    setSendingNotification(true);
    setNotificationType('email');
    
    try {
      // Generate receipt if we don't have one
      let currentReceipt = receipt;
      if (!currentReceipt) {
        currentReceipt = await generateReceipt(transaction);
        setReceipt(currentReceipt);
      }
      
      // Send receipt by email
      if (transaction.recipientContact) {
        await sendReceiptByEmail(currentReceipt, transaction.recipientContact);
        
        toast({
          title: "Receipt Sent",
          description: `Email receipt sent to ${transaction.recipientName}`,
        });
        
        // Also send a push notification if enabled
        const pushEnabled = await PushNotificationService.isEnabled();
        if (pushEnabled) {
          PushNotificationService.simulatePushNotification({
            title: "Receipt Sent",
            body: `Email receipt sent to ${transaction.recipientName}`,
            data: { transactionId: transaction.id }
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Recipient email not available",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending email receipt:', error);
      toast({
        title: "Error",
        description: "Could not send receipt by email",
        variant: "destructive"
      });
    } finally {
      setSendingNotification(false);
      setNotificationType(null);
    }
  };
  
  const handleSendSmsNotification = async () => {
    if (!transaction) return;
    
    setSendingNotification(true);
    setNotificationType('sms');
    
    try {
      // Notify recipient via SMS
      await notifyRecipient({
        recipientId: transaction.recipientId,
        recipientName: transaction.recipientName,
        recipientContact: transaction.recipientContact,
        transactionId: transaction.id,
        // Convert amount to number with safeParseNumber
        amount: safeParseNumber(transaction.amount),
        notificationType: transaction.status === 'completed' 
          ? 'transaction_completed' 
          : transaction.status === 'failed' 
            ? 'transaction_failed' 
            : 'transaction_created',
        contactMethod: 'sms'
      });
      
      toast({
        title: "SMS Sent",
        description: `SMS notification sent to ${transaction.recipientName}`,
      });
      
      // Also send a push notification if enabled
      const pushEnabled = await PushNotificationService.isEnabled();
      if (pushEnabled) {
        PushNotificationService.simulatePushNotification({
          title: "SMS Notification Sent",
          body: `SMS notification sent to ${transaction.recipientName}`,
          data: { transactionId: transaction.id }
        });
      }
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      toast({
        title: "Error",
        description: "Could not send SMS notification",
        variant: "destructive"
      });
    } finally {
      setSendingNotification(false);
      setNotificationType(null);
    }
  };

  return {
    receipt,
    sendingNotification,
    notificationType,
    generatingReceipt,
    refreshInterval,
    setRefreshInterval,
    handleShareTransaction,
    handleDownloadReceipt,
    handleSendAgain,
    handleSendEmailReceipt,
    handleSendSmsNotification
  };
};
