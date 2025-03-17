
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionById, Transaction, updateTransactionStatus } from '@/services/transactions';
import { useNotifications } from '@/contexts/NotificationContext';
import Header from '@/components/Header';
import HeaderRight from '@/components/HeaderRight';
import BottomNavigation from '@/components/BottomNavigation';
import TransactionReceipt from '@/components/transaction/TransactionReceipt';
import StatusUpdateBar from '@/components/transaction/StatusUpdateBar';
import {
  LoadingState,
  TransactionNotFound,
  ActionButtons
} from '@/components/transaction';
import { toast } from '@/hooks/use-toast';
import { 
  generateReceipt, 
  downloadReceiptAsHtml, 
  getReceiptByTransactionId,
  TransactionReceipt as ReceiptType,
  sendReceiptByEmail
} from '@/services/receipt/receiptService';
import { notifyRecipient } from '@/services/notification/notificationService';
import { Button } from '@/components/ui/button';
import { Mail, Smartphone, Download } from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';

const TransactionStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { isOffline } = useNetwork();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [receipt, setReceipt] = useState<ReceiptType | null>(null);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [generatingReceipt, setGeneratingReceipt] = useState(false);

  useEffect(() => {
    // Fetch transaction details
    const fetchTransactionDetails = async () => {
      setLoading(true);
      
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        // Now properly awaiting the async function
        const fetchedTransaction = await getTransactionById(id);
        setTransaction(fetchedTransaction);
        
        // Check if we have a receipt for this transaction
        const existingReceipt = getReceiptByTransactionId(id);
        if (existingReceipt) {
          setReceipt(existingReceipt);
        }
        
        // Add notification for completed transactions
        if (fetchedTransaction && fetchedTransaction.status === 'completed') {
          addNotification({
            title: "Transfer Successful",
            message: `Your transfer of $${fetchedTransaction.amount} to ${fetchedTransaction.recipientName} was successful.`,
            type: 'success',
            transactionId: fetchedTransaction.id
          });
          
          // Clear any refresh interval once transaction is completed
          if (refreshInterval) {
            clearInterval(refreshInterval);
            setRefreshInterval(null);
          }
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
    
    // For pending transactions, start a refresh interval to check for updates
    if (transaction && (transaction.status === 'pending' || transaction.status === 'processing')) {
      // Only set up the interval if it doesn't exist yet
      if (!refreshInterval) {
        const interval = window.setInterval(() => {
          fetchTransactionDetails();
        }, 5000); // Check every 5 seconds
        
        setRefreshInterval(interval);
      }
    }
    
    // Clean up the interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [id, addNotification, refreshInterval, transaction?.status]);

  const handleShareTransaction = () => {
    // In a real app, this would trigger native sharing
    if (navigator.share && transaction) {
      navigator.share({
        title: `Yumvi Pay Transfer - ${transaction.id}`,
        text: `I sent $${transaction.amount} to ${transaction.recipientName} in ${transaction.country}`,
        url: window.location.href
      }).catch(error => {
        console.log('Error sharing:', error);
      });
    } else {
      toast({
        title: "Share",
        description: "Transaction receipt link copied to clipboard!",
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
    }
  };
  
  const handleSendSmsNotification = async () => {
    if (!transaction) return;
    
    setSendingNotification(true);
    
    try {
      // Notify recipient via SMS
      await notifyRecipient({
        recipientId: transaction.recipientId,
        recipientName: transaction.recipientName,
        recipientContact: transaction.recipientContact,
        transactionId: transaction.id,
        amount: transaction.amount,
        notificationType: transaction.status === 'completed' 
          ? 'transaction_completed' 
          : transaction.status === 'failed' 
            ? 'transaction_failed' 
            : 'transaction_created',
        contactMethod: 'sms'
      });
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      toast({
        title: "Error",
        description: "Could not send SMS notification",
        variant: "destructive"
      });
    } finally {
      setSendingNotification(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header 
          title="Transaction" 
          showBackButton={true} 
          rightContent={<HeaderRight showNotification />} 
        />
        <LoadingState />
        <BottomNavigation />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header 
          title="Transaction" 
          showBackButton={true} 
          rightContent={<HeaderRight showNotification />} 
        />
        <TransactionNotFound />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="Transaction Receipt" 
        showBackButton={true} 
        rightContent={<HeaderRight showNotification />} 
      />
      
      <div className="flex-1 p-4 pb-20">
        <TransactionReceipt 
          transaction={transaction}
          onShare={handleShareTransaction}
          onDownload={handleDownloadReceipt}
        />
        
        {(transaction.status === 'pending' || transaction.status === 'processing') && (
          <div className="mt-4">
            <StatusUpdateBar 
              transactionId={transaction.id}
              variant="default"
            />
          </div>
        )}
        
        <div className="mt-4 space-y-3">
          <div className="flex flex-col p-4 bg-gray-50 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3">Notification Options</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 flex items-center justify-center"
                onClick={handleSendEmailReceipt}
                disabled={sendingNotification || isOffline}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 flex items-center justify-center" 
                onClick={handleSendSmsNotification}
                disabled={sendingNotification || isOffline}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Send SMS
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 flex items-center justify-center" 
                onClick={handleDownloadReceipt}
                disabled={generatingReceipt}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            {isOffline && (
              <p className="text-xs text-amber-600 mt-2">
                You are currently offline. Some notification options are unavailable.
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <ActionButtons 
            handleShareTransaction={handleShareTransaction} 
            handleSendAgain={handleSendAgain}
            transactionStatus={transaction.status}
          />
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default TransactionStatus;
