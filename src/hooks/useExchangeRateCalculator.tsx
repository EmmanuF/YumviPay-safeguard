
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNetwork } from '@/contexts/NetworkContext';
import { toast } from '@/hooks/use-toast';
import { 
  getMockExchangeRate, 
  getMockSendingCurrencies, 
  getMockReceivingCurrencies 
} from '@/data/mockExchangeData';

export function useExchangeRateCalculator(onContinue?: () => void) {
  const { isOffline, offlineModeActive } = useNetwork();
  const { isLoggedIn, loading: authLoading } = useAuth();
  
  // State for the form values
  const [sendAmount, setSendAmount] = useState<number>(100);
  const [receiveAmount, setReceiveAmount] = useState<number>(0);
  const [sourceCurrency, setSourceCurrency] = useState<string>('USD');
  const [targetCurrency, setTargetCurrency] = useState<string>('XAF');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Countries and currencies state
  const [sourceCurrencies, setSourceCurrencies] = useState<string[]>([]);
  const [targetCurrencies, setTargetCurrencies] = useState<string[]>([]);
  const [countriesLoading, setCountriesLoading] = useState<boolean>(true);
  const [isUsingMockData, setIsUsingMockData] = useState<boolean>(false);
  
  // Effect to initialize currencies
  useEffect(() => {
    const initializeCurrencies = async () => {
      setCountriesLoading(true);
      
      try {
        let sourceCurs: string[] = [];
        let targetCurs: string[] = [];
        
        // In offline mode or if network is offline, use mock data
        if (isOffline || offlineModeActive) {
          console.log('Using mock currency data due to offline status');
          sourceCurs = getMockSendingCurrencies();
          targetCurs = getMockReceivingCurrencies();
          setIsUsingMockData(true);
        } else {
          try {
            // Try to fetch from Supabase when online
            console.log('Fetching currencies from Supabase');
            
            // Fetch countries that have sending enabled
            const { data: sendingCountries, error: sendingError } = await supabase
              .from('countries')
              .select('currency')
              .eq('is_sending_enabled', true);
            
            if (sendingError) throw sendingError;
            
            // Fetch countries that have receiving enabled
            const { data: receivingCountries, error: receivingError } = await supabase
              .from('countries')
              .select('currency')
              .eq('is_receiving_enabled', true);
            
            if (receivingError) throw receivingError;
            
            // Extract currencies from the countries
            sourceCurs = sendingCountries.map(country => country.currency);
            targetCurs = receivingCountries.map(country => country.currency);
            
            // Check if we have valid data
            if (sourceCurs.length === 0 || targetCurs.length === 0) {
              throw new Error('No currencies available from API');
            }
            
            setIsUsingMockData(false);
          } catch (error) {
            console.error('Error fetching currencies:', error);
            // Fall back to mock data if API fails
            sourceCurs = getMockSendingCurrencies();
            targetCurs = getMockReceivingCurrencies();
            setIsUsingMockData(true);
          }
        }
        
        // Ensure we have unique values
        sourceCurs = [...new Set(sourceCurs)];
        targetCurs = [...new Set(targetCurs)];
        
        console.log('Source currencies:', sourceCurs);
        console.log('Target currencies:', targetCurs);
        
        // Update state with the currencies
        setSourceCurrencies(sourceCurs);
        setTargetCurrencies(targetCurs);
        
        // Set default values if not already set or current value not in options
        if (sourceCurs.length > 0 && !sourceCurs.includes(sourceCurrency)) {
          setSourceCurrency(sourceCurs[0]);
        }
        
        if (targetCurs.length > 0 && !targetCurs.includes(targetCurrency)) {
          setTargetCurrency(targetCurs[0]);
        }
      } catch (error) {
        console.error('Error initializing currencies:', error);
        toast({
          title: 'Error loading currencies',
          description: 'Using default currencies instead',
          variant: 'destructive'
        });
        
        // Use fallback data in case of error
        const fallbackSourceCurs = getMockSendingCurrencies();
        const fallbackTargetCurs = getMockReceivingCurrencies();
        
        setSourceCurrencies(fallbackSourceCurs);
        setTargetCurrencies(fallbackTargetCurs);
        setIsUsingMockData(true);
      } finally {
        setCountriesLoading(false);
      }
    };
    
    initializeCurrencies();
  }, [isOffline, offlineModeActive]);
  
  // Effect to calculate exchange rate and receive amount
  useEffect(() => {
    const calculateRate = async () => {
      if (!sourceCurrency || !targetCurrency) return;
      
      try {
        let rate: number;
        
        // In offline mode or if network is offline, use mock data
        if (isOffline || offlineModeActive || isUsingMockData) {
          rate = getMockExchangeRate(sourceCurrency, targetCurrency);
        } else {
          try {
            // Try to fetch from an exchange rate API
            console.log('Fetching exchange rate from API');
            const response = await fetch(
              `https://api.exchangerate.host/convert?from=${sourceCurrency}&to=${targetCurrency}`
            );
            
            if (!response.ok) throw new Error('Failed to fetch exchange rate');
            
            const data = await response.json();
            rate = data.result || 0;
            
            if (!rate) {
              throw new Error('No exchange rate returned');
            }
          } catch (error) {
            console.error('Error fetching exchange rate:', error);
            // Fall back to mock data if API fails
            rate = getMockExchangeRate(sourceCurrency, targetCurrency);
            setIsUsingMockData(true);
          }
        }
        
        setExchangeRate(rate);
        // Calculate receive amount based on send amount and rate
        setReceiveAmount(Number((sendAmount * rate).toFixed(2)));
      } catch (error) {
        console.error('Error calculating exchange rate:', error);
        // Use a default rate in case of error
        const defaultRate = 600; // Default fallback rate
        setExchangeRate(defaultRate);
        setReceiveAmount(Number((sendAmount * defaultRate).toFixed(2)));
      }
    };
    
    if (sendAmount && sourceCurrency && targetCurrency) {
      calculateRate();
    }
  }, [sendAmount, sourceCurrency, targetCurrency, isOffline, offlineModeActive, isUsingMockData]);
  
  // Handle continue button click
  const handleContinue = useCallback(() => {
    setIsProcessing(true);
    
    try {
      // Store transaction data in localStorage for other components to use
      const transactionData = {
        sendAmount,
        receiveAmount,
        sourceCurrency,
        targetCurrency,
        exchangeRate,
        timestamp: new Date().toISOString(),
      };
      
      localStorage.setItem('pendingTransaction', JSON.stringify(transactionData));
      
      // Call the onContinue callback if provided
      if (onContinue) {
        onContinue();
      }
    } catch (error) {
      console.error('Error saving transaction data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save transaction data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [sendAmount, receiveAmount, sourceCurrency, targetCurrency, exchangeRate, onContinue]);
  
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
    handleContinue,
    isUsingMockData
  };
}
