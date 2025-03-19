
import React, { useState } from 'react';
import { useExchangeRateCalculator } from '@/hooks/exchange-rate';
import InlineCalculator from '@/components/calculator/InlineCalculator';
import FullCalculator from '@/components/calculator/FullCalculator';
import LoadingCalculator from '@/components/calculator/LoadingCalculator';
import ExchangeRatesModal from '@/components/calculator/ExchangeRatesModal';

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
  const [showRatesModal, setShowRatesModal] = useState(false);
  
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
    allExchangeRates
  } = useExchangeRateCalculator(onContinue);

  // Loading state - show skeleton UI
  if (countriesLoading) {
    return <LoadingCalculator className={className} />;
  }

  const handleSeeMoreRates = () => {
    setShowRatesModal(true);
  };

  // In inline mode, we use a simpler layout without the header and descriptions
  if (inlineMode) {
    return (
      <>
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
          onSeeMoreRates={handleSeeMoreRates}
          className={className}
        />
        
        <ExchangeRatesModal
          isOpen={showRatesModal}
          onClose={() => setShowRatesModal(false)}
          rates={allExchangeRates}
        />
      </>
    );
  }

  // Default full mode layout
  return (
    <>
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
        onSeeMoreRates={handleSeeMoreRates}
        className={className}
      />
      
      <ExchangeRatesModal
        isOpen={showRatesModal}
        onClose={() => setShowRatesModal(false)}
        rates={allExchangeRates}
      />
    </>
  );
};

export default ExchangeRateCalculator;
