
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
import PageTransition from '@/components/PageTransition';
import { useCountries } from '@/hooks/useCountries';

type SendMoneyStep = 'recipient' | 'payment' | 'confirmation';

const SendMoney = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, loading, user } = useAuth();
  const { countries, isLoading: countriesLoading } = useCountries();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  console.log('SendMoney - Auth status:', { isLoggedIn, loading, user });
  console.log('SendMoney - Countries loaded:', { countriesLoading, count: countries.length });
  
  // Default to Cameroon if user country not available
  const defaultCountryCode = user?.country || 'CM';
  
  // Find the country by code
  const defaultCountry = countries.find(c => c.code === defaultCountryCode) || 
                         countries.find(c => c.code === 'CM');
  
  console.log('SendMoney - Default country:', { defaultCountryCode, defaultCountry });
  
  const [transactionData, setTransactionData] = useState<any>({
    amount: 100,
    sourceCurrency: 'USD',
    targetCurrency: defaultCountry?.currency || 'XAF',
    targetCountry: defaultCountry?.code || 'CM',
    convertedAmount: 61000,
    recipient: null,
    recipientName: '',
    paymentMethod: null,
    selectedProvider: '',
  });
  
  console.log('SendMoney - Initial transaction data:', transactionData);
  
  const [currentStep, setCurrentStep] = useState<SendMoneyStep>('recipient');

  // Load pending transaction from localStorage if available
  useEffect(() => {
    const timer = setTimeout(() => {
      const pendingTransaction = localStorage.getItem('pendingTransaction');
      
      if (pendingTransaction) {
        try {
          const data = JSON.parse(pendingTransaction);
          console.log('Found pending transaction:', data);
          
          // Find the country with matching currency code
          const targetCountry = countries.find(c => c.currency === data.targetCurrency)?.code || 'CM';
          
          setTransactionData(prev => ({
            ...prev,
            amount: parseFloat(data.sendAmount) || 100,
            sourceCurrency: data.sourceCurrency || 'USD',
            targetCurrency: data.targetCurrency || 'XAF',
            targetCountry,
            convertedAmount: parseFloat(data.receiveAmount?.replace(/,/g, '')) || 61000,
          }));
          
          localStorage.removeItem('pendingTransaction');
        } catch (error) {
          console.error('Error parsing pending transaction:', error);
        }
      }
      
      setInitialDataLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [countries]);

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
    console.log('Updating transaction data:', data);
    setTransactionData(prev => ({ ...prev, ...data }));
  };

  // Show loading state if we're still initializing
  if (loading || countriesLoading || !initialDataLoaded || !authChecked) {
    return <LoadingState message="Preparing your transaction..." />;
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
    <PageTransition>
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
    </PageTransition>
  );
};

export default SendMoney;
