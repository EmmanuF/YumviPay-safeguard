
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurrencySelector from '@/components/calculator/CurrencySelector';
import AmountInput from '@/components/calculator/AmountInput';
import RateDisplay from '@/components/calculator/RateDisplay';

interface InlineCalculatorProps {
  sendAmount: string;
  setSendAmount: (amount: string) => void;
  receiveAmount: string;
  sourceCurrency: string;
  setSourceCurrency: (currency: string) => void;
  targetCurrency: string;
  setTargetCurrency: (currency: string) => void;
  exchangeRate: number;
  isProcessing: boolean;
  authLoading: boolean;
  sourceCurrencies: string[];
  targetCurrencies: string[];
  handleContinue: () => void;
  className?: string;
}

const InlineCalculator: React.FC<InlineCalculatorProps> = ({
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
  sourceCurrencies,
  targetCurrencies,
  handleContinue,
  className
}) => {
  return (
    <div className={`bg-white rounded-3xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-center mb-4">Set Transfer Details</h3>
        
        <div className="flex items-center space-x-4 mb-4">
          <AmountInput
            label="You send"
            value={sendAmount}
            onChange={setSendAmount}
            className="flex-1"
          />
          <CurrencySelector
            value={sourceCurrency}
            onChange={setSourceCurrency}
            options={sourceCurrencies}
            label="Source Currency"
          />
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <AmountInput
            label="They receive"
            value={receiveAmount}
            readOnly={true}
            className="flex-1"
          />
          <CurrencySelector
            value={targetCurrency}
            onChange={setTargetCurrency}
            options={targetCurrencies}
            label="Target Currency"
          />
        </div>
        
        <div className="mb-2">
          <RateDisplay 
            sourceCurrency={sourceCurrency} 
            targetCurrency={targetCurrency} 
            rate={exchangeRate} 
            inline={true}
          />
        </div>
        
        <Button
          onClick={handleContinue}
          className="w-full bg-primary-500 hover:bg-primary-600 py-3 rounded-xl"
          size="lg"
          disabled={authLoading || isProcessing}
        >
          {authLoading || isProcessing ? 'Processing...' : 'Continue'}
          {!authLoading && !isProcessing && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default InlineCalculator;
