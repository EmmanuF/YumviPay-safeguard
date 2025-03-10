
import React from 'react';
import { Transaction } from '@/types/transaction';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorDialog } from '@/utils/transactionUtils';
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

interface TransactionStatusViewProps {
  transaction: Transaction | null;
  loading: boolean;
  error: string | null;
  showErrorDialog: boolean;
  setShowErrorDialog: (show: boolean) => void;
  isResending: boolean;
  isOnline: boolean;
  handleShareTransaction: () => void;
  handleSendAgain: () => void;
  handleResendReceipt: () => void;
  handleDownloadReceipt: () => void;
  retryFetchTransaction: () => void;
}

const TransactionStatusView: React.FC<TransactionStatusViewProps> = ({
  transaction,
  loading,
  error,
  showErrorDialog,
  setShowErrorDialog,
  isResending,
  isOnline,
  handleShareTransaction,
  handleSendAgain,
  handleResendReceipt,
  handleDownloadReceipt,
  retryFetchTransaction,
}) => {
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

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header 
          title="Transaction" 
          showBackButton={true} 
          rightContent={<HeaderRight showNotification />} 
        />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Transaction</h2>
          <p className="text-muted-foreground text-center mb-6">{error}</p>
          <Button onClick={retryFetchTransaction}>Try Again</Button>
        </div>
        <BottomNavigation />
        
        <ErrorDialog
          isOpen={showErrorDialog}
          setIsOpen={setShowErrorDialog}
          title="Transaction Error"
          description={error}
          actionText="Try Again"
          onAction={retryFetchTransaction}
        />
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
      
      <div className="flex-1 p-4 pb-20 overflow-auto">
        <TransactionReceipt 
          transaction={transaction}
          onShare={handleShareTransaction}
          onDownload={handleDownloadReceipt}
          onResend={handleResendReceipt}
        />
        
        {(transaction.status === 'pending' || transaction.status === 'processing') && (
          <div className="mt-4">
            <StatusUpdateBar 
              transactionId={transaction.id}
              variant="default"
            />
          </div>
        )}
        
        <div className="mt-6">
          <ActionButtons 
            handleShareTransaction={handleShareTransaction} 
            handleSendAgain={handleSendAgain}
            handleResendReceipt={handleResendReceipt}
            isResending={isResending}
            transactionStatus={transaction.status}
            isOnline={isOnline}
          />
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default TransactionStatusView;
