
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCountries } from '@/hooks/useCountries';
import { getExchangeRate } from '@/data/exchangeRates';
import { toast } from '@/hooks/use-toast';
import { clearCountriesCache } from './countries/countriesCache';
import { useOfflineFallback } from '@/hooks/useOfflineFallback';
import { generateMockCountries, mockSendingCurrencies, mockReceivingCurrencies, getMockExchangeRate } from '@/data/mockExchangeData';

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
  
  // Use the new useOfflineFallback hook to handle countries data
  const { getCountryByCode, isLoading: originalCountriesLoading, refreshCountries } = useCountries();
  
  // Use our offline fallback hook for getting sending countries
  const { 
    data: sendingCountriesData,
    loading: sendingCountriesLoading,
    isUsingMockData: isUsingSendingMockData,
    refresh: refreshSendingCountries
  } = useOfflineFallback({
    key: 'sending_countries',
    fetchFn: async () => {
      // Since there might be issues with the API, we'll add a safer implementation
      try {
        const countries = await fetch('/api/countries?type=sending').then(res => res.json());
        if (Array.isArray(countries) && countries.length > 0) {
          return countries.map(c => c.currency).filter(Boolean);
        }
        throw new Error('No sending countries returned from API');
      } catch (error) {
        console.error('Error fetching sending countries, using mock data', error);
        return mockSendingCurrencies;
      }
    },
    mockData: mockSendingCurrencies
  });
  
  // Use our offline fallback hook for getting receiving countries
  const { 
    data: receivingCountriesData,
    loading: receivingCountriesLoading,
    isUsingMockData: isUsingReceivingMockData,
    refresh: refreshReceivingCountries
  } = useOfflineFallback({
    key: 'receiving_countries',
    fetchFn: async () => {
      // Since there might be issues with the API, we'll add a safer implementation
      try {
        const countries = await fetch('/api/countries?type=receiving').then(res => res.json());
        if (Array.isArray(countries) && countries.length > 0) {
          return countries.map(c => c.currency).filter(Boolean);
        }
        throw new Error('No receiving countries returned from API');
      } catch (error) {
        console.error('Error fetching receiving countries, using mock data', error);
        return mockReceivingCurrencies;
      }
    },
    mockData: mockReceivingCurrencies
  });
  
  const [sendAmount, setSendAmount] = useState('100');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('XAF'); // Set Cameroon's currency as default
  const [exchangeRate, setExchangeRate] = useState(610); // Updated default rate for USD to XAF
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Combine real and mock data loading states
  const countriesLoading = (!isInitialized && (originalCountriesLoading || sendingCountriesLoading || receivingCountriesLoading));
  
  // Flag to track if we're using mock data
  const isUsingMockData = isUsingSendingMockData || isUsingReceivingMockData;
  
  // First, clear the countries cache to ensure we get fresh data
  useEffect(() => {
    if (!isInitialized) {
      console.log('Initializing ExchangeRateCalculator, clearing cache to ensure fresh data');
      // Clear the cache directly using the imported function
      clearCountriesCache();
      
      // Then refresh the countries data
      refreshCountries();
      
      // Mark as initialized to prevent multiple refreshes
      setIsInitialized(true);
    }
  }, [refreshCountries, isInitialized]);
  
  // Update selected currencies when data loads
  useEffect(() => {
    const sourceCurrencyOptions = sendingCountriesData || mockSendingCurrencies;
    const targetCurrencyOptions = receivingCountriesData || mockReceivingCurrencies;
    
    if (sourceCurrencyOptions?.length > 0 && targetCurrencyOptions?.length > 0) {
      // Verify current source and target currencies are in the lists
      const validSourceCurrency = sourceCurrencyOptions.includes(sourceCurrency) 
        ? sourceCurrency 
        : (sourceCurrencyOptions.includes('USD') ? 'USD' : sourceCurrencyOptions[0]);
        
      const validTargetCurrency = targetCurrencyOptions.includes(targetCurrency)
        ? targetCurrency
        : (targetCurrencyOptions.includes('XAF') ? 'XAF' : targetCurrencyOptions[0]);
      
      if (validSourceCurrency !== sourceCurrency) {
        console.log(`Updating source currency from ${sourceCurrency} to ${validSourceCurrency}`);
        setSourceCurrency(validSourceCurrency);
      }
      
      if (validTargetCurrency !== targetCurrency) {
        console.log(`Updating target currency from ${targetCurrency} to ${validTargetCurrency}`);
        setTargetCurrency(validTargetCurrency);
      }
    }
  }, [sendingCountriesData, receivingCountriesData, sourceCurrency, targetCurrency]);

  // Update exchange rate when currencies change
  useEffect(() => {
    const calculateRate = () => {
      let rate;
      
      // Use mock rates if we're using mock data
      if (isUsingMockData) {
        rate = getMockExchangeRate(sourceCurrency, targetCurrency);
      } else {
        // Get exchange rate from utility function
        rate = getExchangeRate(sourceCurrency, targetCurrency);
      }
      
      // Ensure we have a valid rate
      if (!rate || isNaN(rate) || rate <= 0) {
        console.warn(`Invalid exchange rate for ${sourceCurrency}-${targetCurrency}, using fallback rate`);
        // Fallback to mock rate if available
        rate = getMockExchangeRate(sourceCurrency, targetCurrency);
      }
      
      setExchangeRate(rate);
      
      const amount = parseFloat(sendAmount) || 0;
      setReceiveAmount((amount * rate).toLocaleString());
    };
    
    calculateRate();
  }, [sendAmount, sourceCurrency, targetCurrency, isUsingMockData]);

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

  // Show a message when using mock data
  useEffect(() => {
    if (isUsingMockData && !countriesLoading) {
      toast({
        title: "Using Offline Data",
        description: "You're currently seeing cached or mock exchange rate data.",
        variant: "default"
      });
    }
  }, [isUsingMockData, countriesLoading]);

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
    sourceCurrencies: sendingCountriesData || mockSendingCurrencies,
    targetCurrencies: receivingCountriesData || mockReceivingCurrencies,
    handleContinue,
    isUsingMockData,
    refreshCountries: () => {
      refreshSendingCountries();
      refreshReceivingCountries();
    }
  };
};
