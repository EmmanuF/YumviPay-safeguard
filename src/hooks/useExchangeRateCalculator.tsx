
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCountries } from '@/hooks/useCountries';
import { getExchangeRate } from '@/data/exchangeRates';

export interface ExchangeRateCalculatorState {
  sendAmount: string;
  receiveAmount: string;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  isProcessing: boolean;
}

export const useExchangeRateCalculator = (onContinue?: () => void) => {
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
      amount: parseFloat(sendAmount), // Ensuring it's a number
      receiveAmount: receiveAmount.replace(/,/g, ''),
      exchangeRate
    };
    
    // Save the transaction data to localStorage
    localStorage.setItem('pendingTransaction', JSON.stringify(transactionData));
    
    // Short timeout to ensure UI feedback
    setTimeout(() => {
      if (onContinue) {
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
