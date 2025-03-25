
import React from 'react';
import { Transaction } from '@/types/transaction';
import TransactionReceipt from '@/components/transaction/TransactionReceipt';
import StatusUpdateBar from '@/components/transaction/StatusUpdateBar';
import { ActionButtons } from '@/components/transaction';
import TransactionStatusNotifications from '@/components/transaction/TransactionStatusNotifications';
import { Card } from '@/components/ui/card';

interface TransactionStatusContentProps {
  transaction: Transaction;
  onShare: () => void;
  onDownload: () => void;
  onSendAgain: () => void;
  onSendEmail: () => void;
  onSendSms: () => void;
  sendingNotification: boolean;
  generatingReceipt: boolean;
}

const TransactionStatusContent: React.FC<TransactionStatusContentProps> = ({
  transaction,
  onShare,
  onDownload,
  onSendAgain,
  onSendEmail,
  onSendSms,
  sendingNotification,
  generatingReceipt
}) => {
  const isPending = transaction.status === 'pending' || transaction.status === 'processing';
  const isMinimalData = 
    transaction.recipientName === 'Processing...' || 
    transaction.recipientName === 'Unknown' || 
    transaction.amount === '0';
  
  if (isMinimalData && isPending) {
    // Show simplified content while we wait for full data
    return (
      <div className="flex-1 p-4 pb-20">
        <Card className="p-6 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Transaction details are being processed...
          </p>
        </Card>
        
        <div className="mt-4">
          <StatusUpdateBar 
            transactionId={transaction.id}
            variant="default"
            status={transaction.status}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 p-4 pb-20">
      <TransactionReceipt 
        transaction={transaction}
        onShare={onShare}
        onDownload={onDownload}
      />
      
      {isPending && (
        <div className="mt-4">
          <StatusUpdateBar 
            transactionId={transaction.id}
            variant="default"
            status={transaction.status}
          />
        </div>
      )}
      
      <TransactionStatusNotifications
        onSendEmail={onSendEmail}
        onSendSms={onSendSms}
        onDownload={onDownload}
        sendingNotification={sendingNotification}
        generatingReceipt={generatingReceipt}
      />
      
      <div className="mt-6">
        <ActionButtons 
          handleShareTransaction={onShare} 
          handleSendAgain={onSendAgain}
          transactionStatus={transaction.status}
        />
      </div>
    </div>
  );
};

export default TransactionStatusContent;
