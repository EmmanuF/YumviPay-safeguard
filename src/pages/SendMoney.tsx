
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SendMoneyLayout from '@/components/send-money/SendMoneyLayout';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import PageTransition from '@/components/PageTransition';
import SendMoneyStepRenderer from '@/components/send-money/SendMoneyStepRenderer';
import { useSendMoneySteps } from '@/hooks/useSendMoneySteps';
import { useSendMoneyTransaction } from '@/hooks/useSendMoneyTransaction';
import { toast } from 'sonner';
import LoadingState from '@/components/transaction/LoadingState';

const SendMoney = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  console.log('SendMoney: Auth status:', { isLoggedIn, authLoading, user });
  
  // Default to Cameroon if user country not available
  const defaultCountryCode = user?.country || 'CM';
  
  // Get transaction state with improved error handling
  const { transactionData, updateTransactionData, isInitialized, error: transactionError } = 
    useSendMoneyTransaction(defaultCountryCode);
  
  // Get step management
  const { currentStep, isSubmitting, error: stepError, handleNext, handleBack } = useSendMoneySteps();
  
  // Combined error state
  const error = transactionError || stepError;
  
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
      toast.info("Authentication Required", {
        description: "Please sign in to continue with your transaction."
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
  }, [isInitialized, authChecked, authLoading]);

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

  // Render even if there might be an error, let the error component handle display
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
