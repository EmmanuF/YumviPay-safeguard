
import { useState } from 'react';
import { useInitializeCountries } from './useInitializeCountries';
import { useExchangeRates } from './useExchangeRates';
import { useCurrencySelection } from './useCurrencySelection';
import { useTransactionContinue } from './useTransactionContinue';
import { useNetwork } from '@/contexts/network';

/**
 * Main hook that combines all exchange rate calculator functionality
 */
export const useExchangeRateCalculator = (onContinue?: () => void) => {
  const { isOffline } = useNetwork();
  const [sendAmount, setSendAmount] = useState('100');
  const [showAllRates, setShowAllRates] = useState(false);
  
  // Initialize country and currency lists
  const { sendingCountryList, receivingCountryList, countriesLoading } = useInitializeCountries();
  
  // Handle currency selection
  const { 
    sourceCurrency, 
    setSourceCurrency, 
    targetCurrency, 
    setTargetCurrency 
  } = useCurrencySelection(sendingCountryList, receivingCountryList);
  
  // Handle exchange rate calculations
  const { 
    exchangeRate, 
    receiveAmount, 
    allExchangeRates, 
    generateAllExchangeRates 
  } = useExchangeRates(sendAmount, sourceCurrency, targetCurrency);
  
  // Handle the continue action
  const { 
    handleContinue: continueTransaction, 
    isProcessing, 
    authLoading 
  } = useTransactionContinue(onContinue);

  // When currency lists change, generate all exchange rates
  if (sendingCountryList.length > 0 && receivingCountryList.length > 0) {
    generateAllExchangeRates(sendingCountryList, receivingCountryList);
  }
  
  // Combined handler for continue action
  const handleContinue = () => {
    continueTransaction(
      sendAmount,
      sourceCurrency,
      targetCurrency,
      receiveAmount,
      exchangeRate
    );
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

// Re-export types
export * from './types';
