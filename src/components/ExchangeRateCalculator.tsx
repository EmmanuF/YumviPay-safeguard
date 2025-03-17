
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurrencySelector from '@/components/calculator/CurrencySelector';
import AmountInput from '@/components/calculator/AmountInput';
import RateDisplay from '@/components/calculator/RateDisplay';
import ExchangeSummary from '@/components/calculator/ExchangeSummary';
import { useCountries } from '@/hooks/useCountries';
import { getExchangeRate } from '@/data/exchangeRates';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ExchangeRateCalculatorProps {
  className?: string;
  onContinue?: () => void;
  inlineMode?: boolean;
}

const ExchangeRateCalculator: React.FC<ExchangeRateCalculatorProps> = ({ 
  className,
  onContinue,
  inlineMode = false
}) => {
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { countries, isLoading: countriesLoading } = useCountries();
  const [sendAmount, setSendAmount] = useState('100');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('XAF'); // Set Cameroon's currency as default
  const [exchangeRate, setExchangeRate] = useState(610); // Updated default rate for USD to XAF
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoize currency lists to reduce re-calculation
  const sourceCurrencies = useMemo(() => 
    Array.from(new Set(
      countries
        .filter(country => country.isSendingEnabled)
        .map(country => country.currency)
    )), [countries]);
  
  const targetCurrencies = useMemo(() => 
    Array.from(new Set(
      countries
        .filter(country => country.isReceivingEnabled)
        .map(country => country.currency)
    )), [countries]);

  useEffect(() => {
    const calculateRate = () => {
      // Get exchange rate from utility function
      const rate = getExchangeRate(sourceCurrency, targetCurrency);
      setExchangeRate(rate);
      
      const amount = parseFloat(sendAmount) || 0;
      setReceiveAmount((amount * rate).toLocaleString());
    };
    
    calculateRate();
  }, [sendAmount, sourceCurrency, targetCurrency]);

  const handleContinue = () => {
    // Prevent multiple clicks
    if (isProcessing || authLoading) return;
    
    setIsProcessing(true);
    
    // Store the current exchange information in localStorage for use in next steps
    const transactionData = {
      sourceCurrency,
      targetCurrency,
      sendAmount,
      receiveAmount: receiveAmount.replace(/,/g, ''),
      exchangeRate
    };
    
    // Save the transaction data to localStorage
    localStorage.setItem('pendingTransaction', JSON.stringify(transactionData));
    
    // Short timeout to ensure UI feedback
    setTimeout(() => {
      if (inlineMode && onContinue) {
        // If we're in inline mode, just call the onContinue callback
        onContinue();
      } else if (isLoggedIn) {
        console.log('User is logged in, navigating directly to /send');
        navigate('/send');
      } else {
        console.log('User is not logged in, navigating to signin with redirect');
        navigate('/signin', { state: { redirectTo: '/send' } });
      }
      setIsProcessing(false);
    }, 100);
  };

  // Loading state - show skeleton UI
  if (countriesLoading) {
    return (
      <div className={`bg-white rounded-3xl shadow-xl overflow-hidden ${className}`}>
        <Skeleton className="h-16 w-full" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-24" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-24" />
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // In inline mode, we use a simpler layout without the header and descriptions
  if (inlineMode) {
    return (
      <div className={`bg-white rounded-3xl shadow-lg overflow-hidden ${className}`}>
        <div className="p-6">
          <h3 className="text-xl font-bold text-center mb-4">Set Transfer Details</h3>
          
          <div className="flex items-center space-x-4 mb-4">
            <AmountInput
              label="You send"
              value={sendAmount}
              onChange={setSendAmount}
              className="flex-1"
            />
            <CurrencySelector
              value={sourceCurrency}
              onChange={setSourceCurrency}
              options={sourceCurrencies}
              label="Source Currency"
            />
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <AmountInput
              label="They receive"
              value={receiveAmount}
              readOnly={true}
              className="flex-1"
            />
            <CurrencySelector
              value={targetCurrency}
              onChange={setTargetCurrency}
              options={targetCurrencies}
              label="Target Currency"
            />
          </div>
          
          <div className="mb-2">
            <RateDisplay 
              sourceCurrency={sourceCurrency} 
              targetCurrency={targetCurrency} 
              rate={exchangeRate} 
              inline={true}
            />
          </div>
          
          <Button
            onClick={handleContinue}
            className="w-full bg-primary-500 hover:bg-primary-600 py-3 rounded-xl"
            size="lg"
            disabled={authLoading || isProcessing}
          >
            {authLoading || isProcessing ? 'Processing...' : 'Continue'}
            {!authLoading && !isProcessing && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </div>
    );
  }

  // Default full mode layout
  return (
    <div className={`bg-white rounded-3xl shadow-xl overflow-hidden ${className}`}>
      <RateDisplay 
        sourceCurrency={sourceCurrency} 
        targetCurrency={targetCurrency} 
        rate={exchangeRate} 
      />
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-center mb-4">Send money to your loved ones</h3>
        <p className="text-center text-gray-600 text-sm mb-6">
          We make sure more of your money goes to those you love, not to high service fees
        </p>
        
        <div className="flex items-center space-x-4 mb-4">
          <AmountInput
            label="You send"
            value={sendAmount}
            onChange={setSendAmount}
            className="flex-1"
          />
          <CurrencySelector
            value={sourceCurrency}
            onChange={setSourceCurrency}
            options={sourceCurrencies}
            label="Source Currency"
          />
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <AmountInput
            label="They receive"
            value={receiveAmount}
            readOnly={true}
            className="flex-1"
          />
          <CurrencySelector
            value={targetCurrency}
            onChange={setTargetCurrency}
            options={targetCurrencies}
            label="Target Currency"
          />
        </div>
        
        <ExchangeSummary 
          sourceCurrency={sourceCurrency} 
          targetCurrency={targetCurrency} 
          rate={exchangeRate}
          className="mb-6"
        />
        
        <Button
          onClick={handleContinue}
          className="w-full bg-primary-500 hover:bg-primary-600 py-3 rounded-xl"
          size="lg"
          disabled={authLoading || isProcessing}
        >
          {authLoading || isProcessing ? 'Processing...' : 'Continue'}
          {!authLoading && !isProcessing && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default ExchangeRateCalculator;
