import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SendMoneyLayout from '@/components/send-money/SendMoneyLayout';
import AmountStep from '@/components/send-money/AmountStep';
import RecipientStep from '@/components/send-money/RecipientStep';
import PaymentStep from '@/components/send-money/PaymentStep';
import ConfirmationStep from '@/components/send-money/ConfirmationStep';
import { useToast } from '@/components/ui/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';

type SendMoneyStep = 'amount' | 'recipient' | 'payment' | 'confirmation';

const SendMoney = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Initialize with default values
  const [transactionData, setTransactionData] = useState<any>({
    amount: 100,
    sourceCurrency: 'USD',
    targetCurrency: 'XAF',
    convertedAmount: 61000,
    recipient: null,
    recipientName: '',
    paymentMethod: null,
    selectedProvider: '',
  });
  
  // Initialize starting step - will be updated if we have pending transaction
  const [currentStep, setCurrentStep] = useState<SendMoneyStep>('amount');

  // Check for pending transaction data
  useEffect(() => {
    const pendingTransaction = localStorage.getItem('pendingTransaction');
    
    if (pendingTransaction) {
      try {
        const data = JSON.parse(pendingTransaction);
        console.log('Found pending transaction:', data);
        
        // Update transaction data with values from localStorage
        setTransactionData(prev => ({
          ...prev,
          amount: parseFloat(data.sendAmount) || 100,
          sourceCurrency: data.sourceCurrency || 'USD',
          targetCurrency: data.targetCurrency || 'XAF',
          convertedAmount: parseFloat(data.receiveAmount.replace(/,/g, '')) || 61000,
        }));
        
        // Skip to recipient step if we already have transaction details from homepage
        setCurrentStep('recipient');
        
        // Clear pending transaction after loading it
        localStorage.removeItem('pendingTransaction');
      } catch (error) {
        console.error('Error parsing pending transaction:', error);
      }
    }
    
    setInitialDataLoaded(true);
  }, []);

  // Check authentication status separately
  useEffect(() => {
    // Only check auth status once loading is done
    if (!loading) {
      console.log('Auth status check in SendMoney:', { isLoggedIn });
      setAuthChecked(true);
    }
  }, [loading, isLoggedIn]);

  // Perform redirect if needed once both data and auth are checked
  useEffect(() => {
    if (initialDataLoaded && authChecked && !loading && !isLoggedIn) {
      console.log('User not logged in, redirecting to signin');
      navigate('/signin', { state: { redirectTo: '/send' } });
    }
  }, [initialDataLoaded, authChecked, isLoggedIn, loading, navigate]);

  const handleNext = () => {
    // This is no longer needed as we handle redirect in the useEffect
    // but we'll keep the check as a fallback for safety
    if (!isLoggedIn && currentStep === 'amount') {
      navigate('/signin', { state: { redirectTo: '/send' } });
      return;
    }

    switch (currentStep) {
      case 'amount':
        setCurrentStep('recipient');
        break;
      case 'recipient':
        setCurrentStep('payment');
        break;
      case 'payment':
        setCurrentStep('confirmation');
        break;
      case 'confirmation':
        // Handle transaction completion
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
          setIsSubmitting(false);
          toast({
            title: "Transaction Initiated",
            description: "Your transaction has been initiated successfully.",
          });
          navigate('/transaction/new');
        }, 1500);
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'recipient':
        setCurrentStep('amount');
        break;
      case 'payment':
        setCurrentStep('recipient');
        break;
      case 'confirmation':
        setCurrentStep('payment');
        break;
      default:
        navigate('/');
    }
  };

  const updateTransactionData = (data: Partial<typeof transactionData>) => {
    setTransactionData(prev => ({ ...prev, ...data }));
  };

  // Show loading state until we've checked everything
  if (!initialDataLoaded || loading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 ml-3">Preparing transaction...</p>
      </div>
    );
  }

  // If we've reached this point, the user is authenticated and data is loaded
  const renderStep = () => {
    switch (currentStep) {
      case 'amount':
        return (
          <AmountStep
            transactionData={transactionData}
            updateTransactionData={updateTransactionData}
            onNext={handleNext}
          />
        );
      case 'recipient':
        return (
          <RecipientStep
            transactionData={transactionData}
            updateTransactionData={updateTransactionData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            transactionData={transactionData}
            updateTransactionData={updateTransactionData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'confirmation':
        return (
          <ConfirmationStep
            transactionData={transactionData}
            onConfirm={handleNext}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SendMoneyLayout 
        currentStep={currentStep} 
        stepCount={4}
      >
        {renderStep()}
      </SendMoneyLayout>
      <div className="pb-16"></div>
      <BottomNavigation />
    </div>
  );
};

export default SendMoney;
