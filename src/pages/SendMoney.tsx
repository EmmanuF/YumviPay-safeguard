
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
  const { isLoggedIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  
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

  const handleNext = () => {
    // If not logged in and moving past amount step, redirect to signin
    if (!isLoggedIn && currentStep === 'amount') {
      navigate('/signin', { state: { from: location } });
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

  // Show loading until we've checked for pending transaction
  if (!initialDataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
