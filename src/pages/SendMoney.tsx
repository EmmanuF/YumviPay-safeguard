
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SendMoneyLayout from '@/components/send-money/SendMoneyLayout';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingState from '@/components/dashboard/LoadingState';
import PageTransition from '@/components/PageTransition';
import SendMoneyStepRenderer from '@/components/send-money/SendMoneyStepRenderer';
import { useSendMoneySteps } from '@/hooks/useSendMoneySteps';
import { useSendMoneyTransaction } from '@/hooks/useSendMoneyTransaction';
import { toast } from 'sonner';

const SendMoney = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading, user } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  
  console.log('SendMoney: Auth status:', { isLoggedIn, loading, user });
  
  // Default to Cameroon if user country not available
  const defaultCountryCode = user?.country || 'CM';
  
  // Get transaction state
  const { transactionData, updateTransactionData, isInitialized } = 
    useSendMoneyTransaction(defaultCountryCode);
  
  // Get step management
  const { currentStep, isSubmitting, error, handleNext, handleBack } = useSendMoneySteps();
  
  // Check authentication status
  useEffect(() => {
    console.log('SendMoney: Checking auth status...');
    const timer = setTimeout(() => {
      if (!loading) {
        console.log('SendMoney: Auth status check complete:', { isLoggedIn });
        setAuthChecked(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [loading, isLoggedIn]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authChecked && !loading && !isLoggedIn) {
      console.log('SendMoney: User not logged in, redirecting to signin');
      toast.info("Authentication Required", {
        description: "Please sign in to continue with your transaction."
      });
      navigate('/signin', { state: { redirectTo: '/send' } });
    }
  }, [authChecked, isLoggedIn, loading, navigate]);

  // Log when transaction data is initialized
  useEffect(() => {
    console.log('SendMoney: Transaction initialized:', isInitialized, 'with data:', transactionData);
  }, [isInitialized, transactionData]);

  // Show appropriate loading state
  if (loading || !authChecked) {
    return <LoadingState 
      message="Checking authentication..." 
      submessage="Please wait while we verify your account"
    />;
  }
  
  if (!isInitialized) {
    return <LoadingState 
      message="Preparing your transaction..." 
      submessage="Please wait while we fetch your data"
    />;
  }

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
