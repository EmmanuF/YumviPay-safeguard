
import { useState, useEffect } from 'react';
import { useCurrencyLists } from './useCurrencyLists';
import { useRateCalculation } from './useRateCalculation';
import { useTransactionContinue } from './useTransactionContinue';
import { UseExchangeRateCalculatorReturn, ExchangeRateCalculatorOptions } from './types';

export const useExchangeRateCalculator = (
  onContinue?: ExchangeRateCalculatorOptions['onContinue']
): UseExchangeRateCalculatorReturn => {
  console.log("🔄 useExchangeRateCalculator initializing");
  
  const [sendAmount, setSendAmount] = useState('100');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('XAF'); // Set Cameroon's currency as default

  // Get currency lists
  const { sourceCurrencies, targetCurrencies, countriesLoading } = useCurrencyLists();

  // Calculate exchange rate and receive amount with live rate updates
  const { 
    exchangeRate, 
    receiveAmount,
    isLoading: isLoadingRate,
    error,
    lastUpdated,
    refreshRate,
    rateLimitReached
  } = useRateCalculation({
    sendAmount,
    sourceCurrency,
    targetCurrency
  });

  // Handle continue action
  const { handleContinue, isProcessing, authLoading } = useTransactionContinue({
    sendAmount,
    receiveAmount,
    sourceCurrency,
    targetCurrency,
    exchangeRate,
    onContinue
  });

  // Log any exchange rate errors
  useEffect(() => {
    if (error) {
      console.error("Exchange rate error:", error);
    }
  }, [error]);

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
    isLoadingRate,
    lastRateUpdate: lastUpdated,
    refreshRate,
    rateLimitReached
  };
};
