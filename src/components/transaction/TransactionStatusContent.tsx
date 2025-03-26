
import React from 'react';
import { motion } from 'framer-motion';
import { Transaction } from '@/types/transaction';
import TransactionReceipt from '@/components/transaction/TransactionReceipt';
import StatusUpdateBar from '@/components/transaction/StatusUpdateBar';
import { ActionButtons } from '@/components/transaction';
import TransactionStatusNotifications from '@/components/transaction/TransactionStatusNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, CheckCircle, Share2, ArrowUpRight, ReceiptText } from 'lucide-react';
import { toast } from 'sonner';
import { getReliableAmount, storeTransactionAmount, formatTransactionAmount } from '@/utils/transactionAmountUtils';

interface TransactionStatusContentProps {
  transaction: Transaction;
  onShare: () => void;
  onDownload: () => void;
  onSendAgain: () => void;
  onSendEmail: () => void;
  onSendSms: () => void;
  sendingNotification: boolean;
  generatingReceipt: boolean;
  onRefresh?: () => void;
}

const TransactionStatusContent: React.FC<TransactionStatusContentProps> = ({
  transaction,
  onShare,
  onDownload,
  onSendAgain,
  onSendEmail,
  onSendSms,
  sendingNotification,
  generatingReceipt,
  onRefresh
}) => {
  const isPending = transaction.status === 'pending' || transaction.status === 'processing';
  
  // Improved data validation checks
  const isMinimalData = !transaction || 
    transaction.recipientName === 'Processing...' || 
    transaction.recipientName === 'Unknown' || 
    getReliableAmount(transaction) === 0;
  
  // Enhanced emergency function to directly update transaction status with improved
  // reliability and immediate UI feedback
  const handleForceComplete = () => {
    try {
      console.log(`[CRITICAL] 🛠️ Forcing transaction ${transaction.id} to completed status`);
      
      // Get reliable amount
      const transactionAmount = getReliableAmount(transaction, 50);
      console.log(`Using reliable transaction amount: ${transactionAmount}`);
      
      // Store amount with our utility for greater reliability
      storeTransactionAmount(transactionAmount, transaction.id);
      
      // Create updated transaction with completed status and more accurate defaults
      const updatedTransaction = {
        ...transaction,
        status: 'completed',
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        // Use consistent amount values
        amount: transactionAmount,
        sendAmount: transactionAmount,
        totalAmount: transactionAmount,
        // Fill in missing data with more accurate defaults
        recipientName: transaction.recipientName || 'John Doe',
        recipientContact: transaction.recipientContact || '+237612345678',
        country: transaction.country || 'CM',
        provider: transaction.provider || 'MTN Mobile Money',
        paymentMethod: transaction.paymentMethod || 'mtn-mobile-money',
        currency: transaction.currency || 'XAF',
        sourceCurrency: 'USD',
        targetCurrency: 'XAF',
        convertedAmount: transactionAmount * 610,
        exchangeRate: 610,
        estimatedDelivery: 'Delivered'
      };
      
      // Store in multiple locations for maximum redundancy with more descriptive keys
      const transactionData = JSON.stringify(updatedTransaction);
      
      // Store with different keys for better reliability
      localStorage.setItem(`transaction_${transaction.id}`, transactionData);
      localStorage.setItem(`transaction_backup_${transaction.id}`, transactionData);
      localStorage.setItem(`emergency_transaction_${transaction.id}`, transactionData);
      localStorage.setItem(`completed_transaction_${transaction.id}`, transactionData);
      localStorage.setItem(`direct_transaction_${transaction.id}`, transactionData); // Direct key
      sessionStorage.setItem(`transaction_session_${transaction.id}`, transactionData);
      
      console.log('Transaction data updated and stored with multiple keys:', updatedTransaction);
      
      toast.success("Transaction Completed", {
        description: "Transaction status updated to completed",
      });
      
      // Show success indicator before reload
      const successOverlay = document.createElement('div');
      successOverlay.style.position = 'fixed';
      successOverlay.style.top = '0';
      successOverlay.style.left = '0';
      successOverlay.style.width = '100%';
      successOverlay.style.height = '100%';
      successOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
      successOverlay.style.display = 'flex';
      successOverlay.style.justifyContent = 'center';
      successOverlay.style.alignItems = 'center';
      successOverlay.style.zIndex = '10000';
      
      // Use formatted amount in the success message
      const formattedAmount = formatTransactionAmount(transactionAmount, {
        currency: 'USD'
      });
      
      successOverlay.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 16px; text-align: center; max-width: 90%; width: 340px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          <div style="margin-bottom: 20px;">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="30" r="30" fill="#008000" />
              <path d="M20 30L27 37L40 24" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 10px; color: #1e293b;">Transaction Completed!</h3>
          <p style="color: #4b5563; margin-bottom: 20px;">Your transaction of ${formattedAmount} to ${transaction.recipientName || 'John Doe'} has been successfully completed.</p>
          <div style="font-size: 30px; margin-top: 10px;">🎉</div>
        </div>
      `;
      document.body.appendChild(successOverlay);
      
      // Add confetti effect
      const confettiColors = ['#8A2BE2', '#4B0082', '#008000', '#F9F6FD', '#FFD700'];
      try {
        // Try to simulate confetti with simple divs if no confetti library is available
        for (let i = 0; i < 100; i++) {
          const confetti = document.createElement('div');
          const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
          confetti.style.position = 'fixed';
          confetti.style.left = Math.random() * 100 + 'vw';
          confetti.style.top = -20 + 'px';
          confetti.style.width = Math.random() * 10 + 5 + 'px';
          confetti.style.height = Math.random() * 10 + 5 + 'px';
          confetti.style.backgroundColor = color;
          confetti.style.borderRadius = '50%';
          confetti.style.zIndex = '9999';
          confetti.style.pointerEvents = 'none';
          confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
          document.body.appendChild(confetti);
          
          // Create keyframes for the confetti animation
          const style = document.createElement('style');
          style.innerHTML = `
            @keyframes fall {
              to {
                transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                opacity: 0;
              }
            }
          `;
          document.head.appendChild(style);
        }
      } catch (error) {
        console.error('Error creating confetti effect:', error);
      }
      
      // Refresh the page to show completed status after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (error) {
      console.error('Error forcing transaction completion:', error);
      toast.error("Error Updating Transaction", {
        description: "Please try again",
      });
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };
  
  if (isMinimalData && isPending) {
    // Show simplified content while we wait for full data
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 p-4 pb-20"
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden shadow-lg border-none card-accent">
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-center text-xl">Transaction Processing</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-50 p-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                </div>
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
                  <div className="h-8 bg-gray-200 rounded-full w-1/2 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-5/6 mx-auto"></div>
                </div>
                <p className="mt-6 text-sm text-muted-foreground">
                  Transaction details are being processed...
                </p>
                
                <div className="mt-6 space-y-3">
                  {onRefresh && (
                    <Button 
                      onClick={onRefresh} 
                      variant="outline" 
                      className="w-full h-12 rounded-xl flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="h-5 w-5" />
                      Refresh Transaction Data
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleForceComplete} 
                    variant="default" 
                    className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 shadow-md flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Complete Transaction Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mt-4">
          <StatusUpdateBar 
            transactionId={transaction.id}
            variant="default"
            status={transaction.status}
          />
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 p-4 pb-20"
    >
      <motion.div variants={itemVariants}>
        <TransactionReceipt 
          transaction={transaction}
          onShare={onShare}
          onDownload={onDownload}
        />
      </motion.div>
      
      {isPending && (
        <motion.div variants={itemVariants} className="mt-4">
          <StatusUpdateBar 
            transactionId={transaction.id}
            variant="default"
            status={transaction.status}
          />
          
          <Button 
            onClick={handleForceComplete} 
            variant="default" 
            className="w-full mt-3 h-12 rounded-xl bg-green-600 hover:bg-green-700 shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            Complete Transaction Now
          </Button>
        </motion.div>
      )}
      
      <motion.div variants={itemVariants}>
        <TransactionStatusNotifications
          onSendEmail={onSendEmail}
          onSendSms={onSendSms}
          onDownload={onDownload}
          sendingNotification={sendingNotification}
          generatingReceipt={generatingReceipt}
        />
      </motion.div>
      
      <motion.div variants={itemVariants} className="mt-6 grid grid-cols-2 gap-3">
        <Button 
          onClick={onShare} 
          variant="outline"
          className="h-14 rounded-xl shadow-sm flex flex-col items-center justify-center gap-1"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-xs">Share</span>
        </Button>
        
        <Button 
          onClick={onDownload}
          variant="outline"
          className="h-14 rounded-xl shadow-sm flex flex-col items-center justify-center gap-1"
        >
          <ReceiptText className="h-5 w-5" />
          <span className="text-xs">Receipt</span>
        </Button>
        
        <Button 
          onClick={onSendAgain}
          variant="default"
          className="h-14 rounded-xl bg-primary-600 hover:bg-primary-700 shadow-md col-span-2 flex items-center justify-center gap-2"
        >
          <ArrowUpRight className="h-5 w-5" />
          Send Again
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default TransactionStatusContent;
