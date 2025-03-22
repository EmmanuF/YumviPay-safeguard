import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCountries } from '@/hooks/useCountries';
import { getExchangeRate } from '@/data/exchangeRates';
import { toast } from '@/hooks/use-toast';

export interface ExchangeRateCalculatorState {
  sendAmount: string;
  receiveAmount: string;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  isProcessing: boolean;
}

export const useExchangeRateCalculator = (onContinue?: () => void) => {
  console.log("🔄 useExchangeRateCalculator initializing");
  
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
  const sourceCurrencies = useMemo(() => {
    console.log("🔍 Calculating source currencies");
    
    if (!countries || countries.length === 0) {
      console.log("⚠️ No countries available for source currencies, using fallbacks");
      return ['USD', 'EUR', 'GBP'];
    }
    
    const sendingCountries = countries.filter(country => country.isSendingEnabled);
    console.log(`📤 Found ${sendingCountries.length} sending countries for source currencies`);
    
    if (sendingCountries.length > 0) {
      console.log("📋 Sample sending country:", sendingCountries[0]);
      console.log("📋 All sending countries:", sendingCountries.map(c => c.name));
    }
    
    const currencies = Array.from(new Set(
      sendingCountries.map(country => country.currency)
    ));
    
    console.log("📊 Source currencies generated:", currencies.length);
    console.log("📋 Available source currencies:", currencies);
    
    // Always include USD for testing if no currencies are found
    if (currencies.length === 0) {
      console.log("⚠️ No sending countries found, adding USD, EUR, GBP as defaults");
      return ['USD', 'EUR', 'GBP'];
    }
    
    return currencies;
  }, [countries]);
  
  const targetCurrencies = useMemo(() => {
    console.log("🔍 Calculating target currencies");
    
    if (!countries || countries.length === 0) {
      console.log("⚠️ No countries available for target currencies, using fallbacks");
      return ['XAF', 'NGN', 'KES'];
    }
    
    const receivingCountries = countries.filter(country => country.isReceivingEnabled);
    console.log(`📥 Found ${receivingCountries.length} receiving countries for target currencies`);
    
    if (receivingCountries.length > 0) {
      console.log("📋 Sample receiving country:", receivingCountries[0]);
    }
    
    const currencies = Array.from(new Set(
      receivingCountries.map(country => country.currency)
    ));
    
    console.log("📊 Target currencies generated:", currencies.length);
    console.log("📋 Available target currencies:", currencies);
    
    // Always include XAF for testing if no currencies are found
    if (currencies.length === 0) {
      console.log("⚠️ No receiving countries found, adding XAF, NGN, KES as defaults");
      return ['XAF', 'NGN', 'KES'];
    }
    
    return currencies;
  }, [countries]);

  // Update source currency if it's not in the available currencies
  useEffect(() => {
    if (sourceCurrencies.length > 0 && !sourceCurrencies.includes(sourceCurrency)) {
      console.log(`⚠️ Current source currency ${sourceCurrency} not in available currencies, resetting to ${sourceCurrencies[0]}`);
      setSourceCurrency(sourceCurrencies[0]);
    }
  }, [sourceCurrencies, sourceCurrency]);

  // Update target currency if it's not in the available currencies
  useEffect(() => {
    if (targetCurrencies.length > 0 && !targetCurrencies.includes(targetCurrency)) {
      console.log(`⚠️ Current target currency ${targetCurrency} not in available currencies, resetting to ${targetCurrencies[0]}`);
      setTargetCurrency(targetCurrencies[0]);
    }
  }, [targetCurrencies, targetCurrency]);

  useEffect(() => {
    const calculateRate = () => {
      // Get exchange rate from utility function
      const rate = getExchangeRate(sourceCurrency, targetCurrency);
      setExchangeRate(rate);
      
      const amount = parseFloat(sendAmount) || 0;
      setReceiveAmount((amount * rate).toLocaleString());
      
      console.log(`💱 Exchange rate calculated: 1 ${sourceCurrency} = ${rate} ${targetCurrency}`);
      console.log(`💰 For amount ${sendAmount} ${sourceCurrency} → ${(amount * rate).toLocaleString()} ${targetCurrency}`);
    };
    
    calculateRate();
  }, [sendAmount, sourceCurrency, targetCurrency]);

  const handleContinue = () => {
    // Debug the continue action
    console.log('handleContinue called in useExchangeRateCalculator', { 
      isProcessing, 
      authLoading, 
      onContinue,
      isLoggedIn
    });
    
    // Prevent multiple clicks
    if (isProcessing || authLoading) {
      console.log('Prevented continuation due to processing or loading state');
      return;
    }
    
    setIsProcessing(true);
    
    // Validate amount
    const amountValue = parseFloat(sendAmount);
    if (!amountValue || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to send.",
        variant: "destructive"
      });
      setIsProcessing(false);
      console.log('Invalid amount, preventing continuation');
      return;
    }
    
    // Ensure we have a proper receive amount (convert string with commas to number)
    const cleanedReceiveAmount = receiveAmount.replace(/,/g, '');
    const receiveAmountValue = parseFloat(cleanedReceiveAmount);
    
    // Store the current exchange information in localStorage for use in next steps
    const transactionData = {
      sourceCurrency,
      targetCurrency,
      amount: amountValue,
      receiveAmount: receiveAmountValue.toString(),
      exchangeRate
    };
    
    console.log('Saving transaction data:', transactionData);
    
    try {
      // Save the transaction data to localStorage
      localStorage.setItem('pendingTransaction', JSON.stringify(transactionData));
      
      // Wait to ensure the localStorage write completes
      setTimeout(() => {
        if (onContinue) {
          console.log('Calling onContinue callback directly');
          // If we're in inline mode, call the onContinue callback
          onContinue();
        } else if (isLoggedIn) {
          console.log('User is logged in, navigating directly to /send');
          navigate('/send');
        } else {
          console.log('User is not logged in, navigating to signin with redirect');
          navigate('/signin', { state: { redirectTo: '/send' } });
        }
        
        // Reset processing state after a slight delay to give navigation time
        setTimeout(() => {
          setIsProcessing(false);
        }, 200);
      }, 100);
    } catch (error) {
      console.error('Error in handleContinue:', error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "An error occurred while processing your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    sendAmount,
    setSendAmount,
    receiveAmount,
    sourceCurrency,
    setSourceCurrency,
    targetCurrency,
    setTargetCurrency,
    exchangeRate,
    isProcessing,
    authLoading,
    countriesLoading,
    sourceCurrencies,
    targetCurrencies,
    handleContinue
  };
};
