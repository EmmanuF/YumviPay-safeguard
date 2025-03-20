
import React from 'react';
import { useExchangeRateCalculator } from '@/hooks/useExchangeRateCalculator';
import InlineCalculator from '@/components/calculator/InlineCalculator';
import FullCalculator from '@/components/calculator/FullCalculator';
import LoadingCalculator from '@/components/calculator/LoadingCalculator';

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

  // Loading state - show skeleton UI
  if (countriesLoading) {
    return <LoadingCalculator className={className} />;
  }

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
        sourceCurrencies={sourceCurrencies}
        targetCurrencies={targetCurrencies}
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
      sourceCurrencies={sourceCurrencies}
      targetCurrencies={targetCurrencies}
      handleContinue={handleContinue}
      className={className}
    />
  );
};

export default ExchangeRateCalculator;
