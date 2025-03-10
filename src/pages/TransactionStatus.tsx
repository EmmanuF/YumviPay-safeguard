
import React from 'react';
import { useParams } from 'react-router-dom';
import { TransactionStatusView, useTransactionStatus } from '@/components/transaction-status';

const TransactionStatus = () => {
  const { id } = useParams<{ id: string }>();
  const {
    transaction,
    loading,
    error,
    showErrorDialog,
    setShowErrorDialog,
    isResending,
    isOnline,
    handleShareTransaction,
    handleDownloadReceipt,
    handleSendAgain,
    handleResendReceipt,
    retryFetchTransaction
  } = useTransactionStatus(id);

  return (
    <TransactionStatusView
      transaction={transaction}
      loading={loading}
      error={error}
      showErrorDialog={showErrorDialog}
      setShowErrorDialog={setShowErrorDialog}
      isResending={isResending}
      isOnline={isOnline}
      handleShareTransaction={handleShareTransaction}
      handleSendAgain={handleSendAgain}
      handleResendReceipt={handleResendReceipt}
      handleDownloadReceipt={handleDownloadReceipt}
      retryFetchTransaction={retryFetchTransaction}
    />
  );
};

export default TransactionStatus;
