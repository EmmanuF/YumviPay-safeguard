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
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { countries, isLoading: countriesLoading } = useCountries();
  const [sendAmount, setSendAmount] = useState('100');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('XAF'); // Default to Cameroon's currency
  const [exchangeRate, setExchangeRate] = useState(610); // Default rate for USD to XAF
  const [isProcessing, setIsProcessing] = useState(false);

  // Log initial state for debugging
  useEffect(() => {
    console.log('💰 CALCULATOR INITIALIZED with:', {
      sourceCurrency,
      targetCurrency,
      sendAmount,
      exchangeRate,
      countriesLoaded: countries.length > 0,
      authLoading,
      isLoggedIn
    });
  }, []);

  // Debug country data
  useEffect(() => {
    if (countries.length > 0) {
      // Check if we can correctly get countries by currency
      const usdCountry = countries.find(c => c.currency === 'USD');
      const xafCountry = countries.find(c => c.currency === 'XAF');
      
      console.log('💰 Country Data Check:');
      console.log('USD country:', usdCountry ? `${usdCountry.name} (flag: ${usdCountry.flagUrl})` : 'Not found');
      console.log('XAF country:', xafCountry ? `${xafCountry.name} (flag: ${xafCountry.flagUrl})` : 'Not found');
      
      // Check all source currencies have corresponding countries
      const currencyToCountryMap = new Map();
      countries.forEach(country => {
        if (!currencyToCountryMap.has(country.currency)) {
          currencyToCountryMap.set(country.currency, country);
        }
      });
      
      console.log('💰 Currency to Country mappings available:', Array.from(currencyToCountryMap.keys()).join(', '));
    }
  }, [countries]);

  // Create filtered lists of currencies based on country capabilities
  const sourceCurrencies = useMemo(() => {
    if (countries.length === 0) {
      console.log('🔍 CALCULATOR: No countries loaded, using default source currencies');
      return ['USD', 'EUR', 'GBP', 'CAD']; // Default currencies when countries not loaded
    }
    
    const sendingCountries = countries.filter(country => country.isSendingEnabled);
    console.log('🔍 CALCULATOR CURRENCIES: Source currencies from countries:', 
                sendingCountries.map(c => `${c.name} (${c.currency})`).join(', '));
    
    // Additional check for African countries that shouldn't be in sending list
    const africanCodes = ['CM', 'GH', 'NG', 'SN'];
    const africanSendingCountries = sendingCountries.filter(c => africanCodes.includes(c.code));
    
    if (africanSendingCountries.length > 0) {
      console.log('🔍 CALCULATOR ERROR: African countries incorrectly marked as sending:', 
                  africanSendingCountries.map(c => `${c.name} (isSendingEnabled=${c.isSendingEnabled})`).join(', '));
    }
    
    // Ensure we always have some source currencies even if none are configured correctly
    let currencies = Array.from(new Set(sendingCountries.map(country => country.currency)));
    
    if (currencies.length === 0) {
      console.log('🔍 CALCULATOR: No sending countries found, using default currencies');
      currencies = ['USD', 'EUR', 'GBP', 'CAD']; // Fallback if no sending countries
    }
    
    console.log('🔍 CALCULATOR CURRENCIES: Final source currencies:', currencies.join(', '));
    return currencies;
  }, [countries]);
  
  const targetCurrencies = useMemo(() => {
    if (countries.length === 0) {
      console.log('🔍 CALCULATOR: No countries loaded, using default target currencies');
      return ['XAF', 'NGN', 'GHS']; // Default African currencies when countries not loaded
    }
    
    const receivingCountries = countries.filter(country => country.isReceivingEnabled);
    console.log('🔍 CALCULATOR CURRENCIES: Target currencies from countries:', 
                receivingCountries.map(c => `${c.name} (${c.currency})`).join(', '));
    
    // Ensure we always have some target currencies even if none are configured correctly
    let currencies = Array.from(new Set(receivingCountries.map(country => country.currency)));
    
    if (currencies.length === 0) {
      console.log('🔍 CALCULATOR: No receiving countries found, using XAF as default');
      currencies = ['XAF', 'NGN', 'GHS']; // Fallback to African currencies
    }
    
    console.log('🔍 CALCULATOR CURRENCIES: Final target currencies:', currencies.join(', '));
    return currencies;
  }, [countries]);

  // Calculate receive amount when inputs change
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
