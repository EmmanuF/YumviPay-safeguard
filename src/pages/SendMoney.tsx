
import React, { useEffect, useState } from 'react';
import { useSendMoneyPage } from '@/hooks/useSendMoneyPage';
import SendMoneyContainer from '@/components/send-money/SendMoneyContainer';
import LoadingState from '@/components/transaction/LoadingState';
import { useNetwork } from '@/contexts/NetworkContext';

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
  
  const { isOffline, offlineModeActive } = useNetwork();
  const [error, setError] = useState<string | Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    console.log('SendMoney page rendering with states:', { 
      authLoading, 
      authChecked, 
      pageLoading, 
      needsInitialData,
      isOffline,
      offlineModeActive,
      retryCount
    });
    
    // If we're experiencing network issues but not showing loading state,
    // we should proceed to the UI even if we don't have all data
    if ((isOffline || offlineModeActive) && pageLoading && retryCount > 1) {
      console.log('Network issues detected, proceeding with offline mode');
      setPageLoading(false);
    }
  }, [authLoading, authChecked, pageLoading, needsInitialData, isOffline, offlineModeActive, retryCount]);
  
  // Set a timeout to ensure we don't get stuck in loading state
  useEffect(() => {
    if (pageLoading) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        
        if (retryCount >= 2) {
          console.log('Maximum retries reached, proceeding with page');
          setPageLoading(false);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [pageLoading, retryCount]);
  
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
