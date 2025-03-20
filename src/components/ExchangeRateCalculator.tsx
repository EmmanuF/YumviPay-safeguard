
import React, { useState, useEffect } from 'react';
import { useExchangeRateCalculator } from '@/hooks/useExchangeRateCalculator';
import InlineCalculator from '@/components/calculator/InlineCalculator';
import FullCalculator from '@/components/calculator/FullCalculator';
import LoadingCalculator from '@/components/calculator/LoadingCalculator';
import { toast } from '@/hooks/use-toast';

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
  const [hasError, setHasError] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);

  const {
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
  } = useExchangeRateCalculator(onContinue);

  // Add error handling for empty currencies
  useEffect(() => {
    // If we have no currencies but we're not loading, that's an error
    if (!countriesLoading && (sourceCurrencies.length === 0 || targetCurrencies.length === 0)) {
      console.log('Error: No currencies available', { 
        sourceCurrencies: sourceCurrencies.length, 
        targetCurrencies: targetCurrencies.length,
        loading: countriesLoading
      });
      
      if (retryAttempts < 3) {
        // Retry loading after a short delay
        const timer = setTimeout(() => {
          setRetryAttempts(prev => prev + 1);
          console.log(`Retrying currency load, attempt ${retryAttempts + 1}`);
          // The refreshCountries functionality is built into the useExchangeRateCalculator hook
        }, 1000);
        
        return () => clearTimeout(timer);
      } else if (!hasError) {
        setHasError(true);
        toast({
          title: "Currency data unavailable",
          description: "Using default values. You can still use the calculator.",
          variant: "destructive"
        });
      }
    }
  }, [countriesLoading, sourceCurrencies, targetCurrencies, retryAttempts, hasError]);

  // Always show at least loading state during initial load
  if (countriesLoading || (sourceCurrencies.length === 0 && targetCurrencies.length === 0)) {
    return <LoadingCalculator className={className} />;
  }

  // Fallback to defaults if we still have no currencies
  const finalSourceCurrencies = sourceCurrencies.length > 0 ? sourceCurrencies : ['USD', 'EUR', 'GBP'];
  const finalTargetCurrencies = targetCurrencies.length > 0 ? targetCurrencies : ['XAF', 'NGN', 'GHS'];

  // In inline mode, we use a simpler layout without the header and descriptions
  if (inlineMode) {
    return (
      <InlineCalculator
        sendAmount={sendAmount}
        setSendAmount={setSendAmount}
        receiveAmount={receiveAmount}
        sourceCurrency={sourceCurrency}
        setSourceCurrency={setSourceCurrency}
        targetCurrency={targetCurrency}
        setTargetCurrency={setTargetCurrency}
        exchangeRate={exchangeRate}
        isProcessing={isProcessing}
        authLoading={authLoading}
        sourceCurrencies={finalSourceCurrencies}
        targetCurrencies={finalTargetCurrencies}
        handleContinue={handleContinue}
        className={className}
      />
    );
  }

  // Default full mode layout
  return (
    <FullCalculator
      sendAmount={sendAmount}
      setSendAmount={setSendAmount}
      receiveAmount={receiveAmount}
      sourceCurrency={sourceCurrency}
      setSourceCurrency={setSourceCurrency}
      targetCurrency={targetCurrency}
      setTargetCurrency={setTargetCurrency}
      exchangeRate={exchangeRate}
      isProcessing={isProcessing}
      authLoading={authLoading}
      sourceCurrencies={finalSourceCurrencies}
      targetCurrencies={finalTargetCurrencies}
      handleContinue={handleContinue}
      className={className}
    />
  );
};

export default ExchangeRateCalculator;
