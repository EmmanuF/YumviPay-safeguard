
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SendMoneyLayout from '@/components/send-money/SendMoneyLayout';
import RecipientStep from '@/components/send-money/RecipientStep';
import PaymentStep from '@/components/send-money/PaymentStep';
import ConfirmationStep from '@/components/send-money/ConfirmationStep';
import { useToast } from '@/components/ui/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingState from '@/components/transaction/LoadingState';

type SendMoneyStep = 'recipient' | 'payment' | 'confirmation';

const SendMoney = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
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
  
  const [currentStep, setCurrentStep] = useState<SendMoneyStep>('recipient');

  useEffect(() => {
    const timer = setTimeout(() => {
      const pendingTransaction = localStorage.getItem('pendingTransaction');
      
      if (pendingTransaction) {
        try {
          const data = JSON.parse(pendingTransaction);
          console.log('Found pending transaction:', data);
          
          setTransactionData(prev => ({
            ...prev,
            amount: parseFloat(data.sendAmount) || 100,
            sourceCurrency: data.sourceCurrency || 'USD',
            targetCurrency: data.targetCurrency || 'XAF',
            convertedAmount: parseFloat(data.receiveAmount.replace(/,/g, '')) || 61000,
          }));
          
          localStorage.removeItem('pendingTransaction');
        } catch (error) {
          console.error('Error parsing pending transaction:', error);
        }
      }
      
      setInitialDataLoaded(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        console.log('Auth status check in SendMoney:', { isLoggedIn });
        setAuthChecked(true);
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [loading, isLoggedIn]);

  useEffect(() => {
    if (initialDataLoaded && authChecked && !loading && !isLoggedIn) {
      console.log('User not logged in, redirecting to signin');
      navigate('/signin', { state: { redirectTo: '/send' } });
    }
  }, [initialDataLoaded, authChecked, isLoggedIn, loading, navigate]);

  const handleNext = () => {
    if (!isLoggedIn) {
      navigate('/signin', { state: { redirectTo: '/send' } });
      return;
    }

    switch (currentStep) {
      case 'recipient':
        setCurrentStep('payment');
        break;
      case 'payment':
        setCurrentStep('confirmation');
        break;
      case 'confirmation':
        setIsSubmitting(true);
        setTimeout(() => {
          setIsSubmitting(false);
          toast({
            title: "Transaction Initiated",
            description: "Your transaction has been initiated successfully.",
          });
          navigate('/transaction/new');
        }, 1000);
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
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

  if (!initialDataLoaded || loading || !authChecked) {
    return <LoadingState />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'recipient':
        return (
          <RecipientStep
            transactionData={transactionData}
            updateTransactionData={updateTransactionData}
            onNext={handleNext}
            onBack={() => navigate('/')}
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
        stepCount={3}
      >
        {renderStep()}
      </SendMoneyLayout>
      <div className="pb-16"></div>
      <BottomNavigation />
    </div>
  );
};

export default SendMoney;
