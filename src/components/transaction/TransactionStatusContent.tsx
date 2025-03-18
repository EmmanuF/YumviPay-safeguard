
import React from 'react';
import { Transaction } from '@/types/transaction';
import TransactionReceipt from '@/components/transaction/TransactionReceipt';
import StatusUpdateBar from '@/components/transaction/StatusUpdateBar';
import { ActionButtons } from '@/components/transaction';
import TransactionStatusNotifications from '@/components/transaction/TransactionStatusNotifications';

interface TransactionStatusContentProps {
  transaction: Transaction;
  onShare: () => void;
  onDownload: () => void;
  onSendAgain: () => void;
  onSendEmail: () => void;
  onSendSms: () => void;
  sendingNotification: boolean;
  notificationType?: 'email' | 'sms' | null;
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
  notificationType,
  generatingReceipt
}) => {
  const isPending = transaction.status === 'pending' || transaction.status === 'processing';
  
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
        notificationType={notificationType}
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
