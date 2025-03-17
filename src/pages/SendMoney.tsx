
import React, { useEffect, useState } from 'react';
import { useSendMoneyPage } from '@/hooks/useSendMoneyPage';
import SendMoneyContainer from '@/components/send-money/SendMoneyContainer';
import LoadingState from '@/components/transaction/LoadingState';

const SendMoney = () => {
  const {
    authLoading,
    authChecked,
    pageLoading,
    setPageLoading,
    needsInitialData,
    setNeedsInitialData,
    defaultCountryCode
  } = useSendMoneyPage();
  
  const [error, setError] = useState<string | Error | null>(null);
  
  // Handler for continuing after selecting amount and currencies
  const handleInitialDataContinue = () => {
    console.log('Initial data continue handler called');
    // Get the transaction data from localStorage
    try {
      const pendingTransaction = localStorage.getItem('pendingTransaction');
      if (pendingTransaction) {
        const data = JSON.parse(pendingTransaction);
        console.log('Retrieved transaction data for continuation:', data);
        
        // Store for retrieval in transaction hook
        localStorage.setItem('processedPendingTransaction', pendingTransaction);
      }
    } catch (err) {
      console.error('Error retrieving pending transaction:', err);
      setError(err instanceof Error ? err : String(err));
    }
    
    // Move on to the next step
    setNeedsInitialData(false);
  };

  // Show appropriate loading state
  if (authLoading || !authChecked) {
    return <LoadingState 
      message="Checking authentication..." 
      submessage="Please wait while we verify your account"
    />;
  }

  return (
    <SendMoneyContainer
      isLoading={pageLoading}
      needsInitialData={needsInitialData}
      error={error}
      defaultCountryCode={defaultCountryCode}
      onInitialDataContinue={handleInitialDataContinue}
    />
  );
};

export default SendMoney;
