
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

const SendMoney = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading, user } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  
  // Default to Cameroon if user country not available
  const defaultCountryCode = user?.country || 'CM';
  
  // Get transaction state
  const { transactionData, updateTransactionData, isInitialized } = 
    useSendMoneyTransaction(defaultCountryCode);
  
  // Get step management
  const { currentStep, isSubmitting, handleNext, handleBack } = useSendMoneySteps();
  
  // Check authentication status
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        console.log('Auth status check complete:', { isLoggedIn });
        setAuthChecked(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [loading, isLoggedIn]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isInitialized && authChecked && !loading && !isLoggedIn) {
      console.log('User not logged in, redirecting to signin');
      navigate('/signin', { state: { redirectTo: '/send' } });
    }
  }, [isInitialized, authChecked, isLoggedIn, loading, navigate]);

  // Show loading state if we're still initializing
  if (loading || !isInitialized || !authChecked) {
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
          />
        </SendMoneyLayout>
        <div className="pb-16"></div>
        <BottomNavigation />
      </div>
    </PageTransition>
  );
};

export default SendMoney;
