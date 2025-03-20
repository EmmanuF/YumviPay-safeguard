
import React, { useState, useEffect } from 'react';
import { useExchangeRateCalculator } from '@/hooks/useExchangeRateCalculator';
import InlineCalculator from '@/components/calculator/InlineCalculator';
import FullCalculator from '@/components/calculator/FullCalculator';
import LoadingCalculator from '@/components/calculator/LoadingCalculator';
import { toast } from '@/hooks/use-toast';
import { WifiOff } from 'lucide-react';

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
  const [forceUseDefaults, setForceUseDefaults] = useState(false);

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
    handleContinue,
    isUsingMockData
  } = useExchangeRateCalculator(onContinue);

  // Add error handling for empty currencies
  useEffect(() => {
    // If we have no currencies but we're not loading, that's an error
    if (!countriesLoading && 
        ((sourceCurrencies.length === 0 || targetCurrencies.length === 0) && !forceUseDefaults)) {
      console.log('Error: No currencies available', { 
        sourceCurrencies: sourceCurrencies.length, 
        targetCurrencies: targetCurrencies.length,
        loading: countriesLoading,
        forceUseDefaults
      });
      
      if (retryAttempts < 2) {
        // Retry loading after a short delay
        const timer = setTimeout(() => {
          setRetryAttempts(prev => prev + 1);
          console.log(`Retrying currency load, attempt ${retryAttempts + 1}`);
          // The refreshCountries functionality is built into the useExchangeRateCalculator hook
        }, 1000);
        
        return () => clearTimeout(timer);
      } else if (!hasError) {
        console.log('Max retry attempts reached, falling back to default currencies');
        setHasError(true);
        setForceUseDefaults(true);
        toast({
          title: "Currency data unavailable",
          description: "Using default values. You can still use the calculator.",
          variant: "destructive"
        });
      }
    }
  }, [countriesLoading, sourceCurrencies, targetCurrencies, retryAttempts, hasError, forceUseDefaults]);

  // Always show at least loading state during initial load
  if (countriesLoading && retryAttempts < 2 && !forceUseDefaults) {
    return <LoadingCalculator className={className} />;
  }

  // Fallback to defaults if we still have no currencies or if we're forcing defaults
  const finalSourceCurrencies = (sourceCurrencies.length > 0 && !forceUseDefaults) 
    ? sourceCurrencies 
    : ['USD', 'EUR', 'GBP', 'CAD', 'CHF', 'AUD'];
    
  const finalTargetCurrencies = (targetCurrencies.length > 0 && !forceUseDefaults) 
    ? targetCurrencies 
    : ['XAF', 'NGN', 'GHS', 'KES', 'ZAR', 'UGX'];

  // Render offline indicator if using mock data
  const OfflineIndicator = () => (isUsingMockData || forceUseDefaults) ? (
    <div className="flex items-center justify-center bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-medium mb-2">
      <WifiOff className="h-3 w-3 mr-1" />
      <span>Using offline data</span>
    </div>
  ) : null;

  // Convert number values to strings for the component props
  const sendAmountStr = sendAmount.toString();
  const receiveAmountStr = receiveAmount.toString();
  
  // Create wrapper functions to handle string-to-number conversion
  const handleSendAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setSendAmount(numValue);
  };

  // In inline mode, we use a simpler layout without the header and descriptions
  if (inlineMode) {
    return (
      <div className={className}>
        <OfflineIndicator />
        <InlineCalculator
          sendAmount={sendAmountStr}
          setSendAmount={handleSendAmountChange}
          receiveAmount={receiveAmountStr}
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
        />
      </div>
    );
  }

  // Default full mode layout
  return (
    <div className={className}>
      <OfflineIndicator />
      <FullCalculator
        sendAmount={sendAmountStr}
        setSendAmount={handleSendAmountChange}
        receiveAmount={receiveAmountStr}
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
      />
    </div>
  );
};

export default ExchangeRateCalculator;
