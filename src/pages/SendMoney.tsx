
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SendMoneyLayout from '@/components/send-money/SendMoneyLayout';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/PageTransition';
import SendMoneyStepRenderer from '@/components/send-money/SendMoneyStepRenderer';
import { useSendMoneySteps } from '@/hooks/useSendMoneySteps';
import { useSendMoneyTransaction } from '@/hooks/useSendMoneyTransaction';
import { toast } from '@/hooks/use-toast';
import LoadingState from '@/components/transaction/LoadingState';
import ExchangeRateCalculator from '@/components/ExchangeRateCalculator';
import { showErrorToast } from '@/utils/errorHandling';

const SendMoney = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [needsInitialData, setNeedsInitialData] = useState(true); // Start by assuming we need initial data
  
  console.log('SendMoney: Auth status:', { isLoggedIn, authLoading, user });
  
  // Default to Cameroon if user country not available
  const defaultCountryCode = user?.country || 'CM';
  
  // Get transaction state with improved error handling
  const { transactionData, updateTransactionData, isInitialized, error: transactionError } = 
    useSendMoneyTransaction(defaultCountryCode);
  
  // Get step management
  const { currentStep, isSubmitting, error: stepError, handleNext, handleBack } = useSendMoneySteps();
  
  // Combined error state - ensure it's never null
  const error = transactionError || stepError || null;
  
  // Check if we need to collect initial transaction data
  useEffect(() => {
    if (isInitialized && transactionData) {
      // Check if we have the necessary data to proceed
      const hasRequiredData = transactionData.sourceCurrency && 
                             transactionData.targetCurrency && 
                             transactionData.amount > 0;
                             
      setNeedsInitialData(!hasRequiredData);
      console.log('SendMoney: Needs initial data?', !hasRequiredData, 'Data:', transactionData);
    }
  }, [isInitialized, transactionData]);
  
  // Check authentication status
  useEffect(() => {
    console.log('SendMoney: Checking auth status...', { authLoading });
    
    const timer = setTimeout(() => {
      if (!authLoading) {
        console.log('SendMoney: Auth check complete:', { isLoggedIn });
        setAuthChecked(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [authLoading, isLoggedIn]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authChecked && !authLoading && !isLoggedIn) {
      console.log('SendMoney: User not logged in, redirecting to signin');
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with your transaction.",
        variant: "default"
      });
      navigate('/signin', { state: { redirectTo: '/send' } });
    }
  }, [authChecked, isLoggedIn, authLoading, navigate]);

  // Set page loading state
  useEffect(() => {
    console.log('SendMoney: Transaction state:', { 
      isInitialized, 
      authChecked, 
      authLoading,
      pageLoading 
    });
    
    if (authChecked && isInitialized) {
      // Small delay to ensure components are ready
      const timer = setTimeout(() => {
        setPageLoading(false);
        console.log('SendMoney: Page ready to render');
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isInitialized, authChecked, authLoading, pageLoading]);

  // Handler for continuing after selecting amount and currencies
  const handleInitialDataContinue = () => {
    console.log('Initial data continue handler called');
    // Get the transaction data from localStorage
    try {
      const pendingTransaction = localStorage.getItem('pendingTransaction');
      if (pendingTransaction) {
        const data = JSON.parse(pendingTransaction);
        console.log('Retrieved transaction data for continuation:', data);
        
        // Update our transaction data with the values from the calculator
        updateTransactionData({
          amount: parseFloat(data.amount),
          sourceCurrency: data.sourceCurrency,
          targetCurrency: data.targetCurrency,
          convertedAmount: parseFloat(data.receiveAmount)
        });
      }
    } catch (error) {
      console.error('Error retrieving pending transaction:', error);
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
  
  if (pageLoading || !isInitialized) {
    return <LoadingState 
      message="Preparing your transaction..." 
      submessage="Please wait while we fetch your data"
    />;
  }

  // Fix TypeScript errors with proper error handling
  if (error) {
    // Safe conversion to string for any error type
    let errorMessage = "An unexpected error occurred";
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      // Check if error has a message property
      errorMessage = 'message' in error && typeof error.message === 'string' 
        ? error.message 
        : "Error processing your transaction";
    }
    
    return <LoadingState 
      message="Error loading transaction data" 
      submessage={errorMessage}
    />;
  }

  // If we need to collect initial data, show the exchange rate calculator
  if (needsInitialData) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <SendMoneyLayout 
            currentStep={0} 
            stepCount={4}
            title="Set Transfer Details"
          >
            <div className="p-4">
              <ExchangeRateCalculator 
                onContinue={handleInitialDataContinue}
                inlineMode={true}
              />
            </div>
          </SendMoneyLayout>
          <div className="pb-16"></div>
          <BottomNavigation />
        </div>
      </PageTransition>
    );
  }

  // Render normal send money flow once we have the initial data
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <SendMoneyLayout 
          currentStep={currentStep} 
          stepCount={3}
        >
          <SendMoneyStepRenderer
            currentStep={currentStep}
            transactionData={transactionData}
            updateTransactionData={updateTransactionData}
            onNext={handleNext}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            error={error}
          />
        </SendMoneyLayout>
        <div className="pb-16"></div>
        <BottomNavigation />
      </div>
    </PageTransition>
  );
};

export default SendMoney;
