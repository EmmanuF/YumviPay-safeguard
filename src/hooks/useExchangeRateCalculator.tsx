import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCountries } from '@/hooks/useCountries';
import { getExchangeRate } from '@/data/exchangeRates';
import { toast } from '@/hooks/use-toast';
import { clearCountriesCache } from './countries/countriesCache';
import { useNetwork } from '@/contexts/network';

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
  const { countries, isLoading: countriesLoading, getSendingCountries, getReceivingCountries, refreshCountries } = useCountries();
  const { isOffline } = useNetwork();
  
  const [sendAmount, setSendAmount] = useState('100');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('XAF'); // Set Cameroon's currency as default
  const [exchangeRate, setExchangeRate] = useState(610); // Updated default rate for USD to XAF
  const [isProcessing, setIsProcessing] = useState(false);
  const [sendingCountryList, setSendingCountryList] = useState<string[]>([]);
  const [receivingCountryList, setReceivingCountryList] = useState<string[]>([]);
  const [showAllRates, setShowAllRates] = useState(false);
  const [allExchangeRates, setAllExchangeRates] = useState<{from: string, to: string, rate: number}[]>([]);

  // First, clear the countries cache to ensure we get fresh data
  useEffect(() => {
    console.log('Initializing ExchangeRateCalculator, clearing cache to ensure fresh data');
    // Clear the cache directly using the imported function
    clearCountriesCache();
    
    // Then refresh the countries data
    refreshCountries();
  }, [refreshCountries]);

  // Load sending and receiving countries on component mount
  useEffect(() => {
    const loadCountryLists = async () => {
      console.log('Loading country lists in useExchangeRateCalculator');
      
      try {
        // Fetch sending countries
        console.log('Fetching sending countries...');
        const sendingCountries = await getSendingCountries();
        console.log('Got sending countries:', sendingCountries.map(c => c.name).join(', '));
        
        const sendingCurrencies = Array.from(new Set(
          sendingCountries.map(country => country.currency)
        )).sort();
        
        console.log('Sending currencies retrieved:', sendingCurrencies);
        setSendingCountryList(sendingCurrencies);
        
        // Fetch receiving countries
        console.log('Fetching receiving countries...');
        const receivingCountries = await getReceivingCountries();
        console.log('Got receiving countries:', receivingCountries.map(c => c.name).join(', '));
        
        const receivingCurrencies = Array.from(new Set(
          receivingCountries.map(country => country.currency)
        )).sort();
        
        console.log('Receiving currencies retrieved:', receivingCurrencies);
        setReceivingCountryList(receivingCurrencies);
        
        // If the source currency isn't in the sending list, reset it to USD or first available
        if (sendingCurrencies.length > 0) {
          if (!sendingCurrencies.includes(sourceCurrency)) {
            const defaultCurrency = sendingCurrencies.includes('USD') ? 'USD' : sendingCurrencies[0];
            console.log(`Resetting source currency to ${defaultCurrency}`);
            setSourceCurrency(defaultCurrency);
          } else {
            console.log(`Keeping source currency as ${sourceCurrency}`);
          }
        } else {
          console.warn('No sending currencies available!');
        }
        
        // If the target currency isn't in the receiving list, reset it to XAF or first available
        if (receivingCurrencies.length > 0) {
          if (!receivingCurrencies.includes(targetCurrency)) {
            const defaultCurrency = receivingCurrencies.includes('XAF') ? 'XAF' : receivingCurrencies[0];
            console.log(`Resetting target currency to ${defaultCurrency}`);
            setTargetCurrency(defaultCurrency);
          } else {
            console.log(`Keeping target currency as ${targetCurrency}`);
          }
        } else {
          console.warn('No receiving currencies available!');
        }
        
        // Generate all exchange rates combinations for the "See more rates" feature
        generateAllExchangeRates(sendingCurrencies, receivingCurrencies);
      } catch (error) {
        console.error('Error loading country lists:', error);
      }
    };
    
    // Only load country lists if countries data is available
    if (countries.length > 0) {
      loadCountryLists();
    } else {
      console.log('Countries data not yet available, waiting...');
    }
  }, [countries, getSendingCountries, getReceivingCountries, sourceCurrency, targetCurrency]);

  // Generate all possible exchange rate combinations
  const generateAllExchangeRates = (sendingCurrencies: string[], receivingCurrencies: string[]) => {
    // Take at most 5 sending and 5 receiving currencies to keep the list manageable
    const topSendingCurrencies = sendingCurrencies.slice(0, 5);
    const topReceivingCurrencies = receivingCurrencies.slice(0, 5);
    
    const rates: {from: string, to: string, rate: number}[] = [];
    
    topSendingCurrencies.forEach(from => {
      topReceivingCurrencies.forEach(to => {
        const rate = getExchangeRate(from, to);
        rates.push({ from, to, rate });
      });
    });
    
    setAllExchangeRates(rates);
  };

  // Update exchange rate when currencies change
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

  const toggleRatesDisplay = () => {
    setShowAllRates(!showAllRates);
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
    sourceCurrencies: sendingCountryList,
    targetCurrencies: receivingCountryList,
    handleContinue,
    showAllRates,
    toggleRatesDisplay,
    allExchangeRates
  };
};
