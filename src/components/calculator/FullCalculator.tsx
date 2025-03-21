
import React from 'react';
import { ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurrencySelector from '@/components/calculator/CurrencySelector';
import AmountInput from '@/components/calculator/AmountInput';
import RateDisplay from '@/components/calculator/RateDisplay';
import ExchangeSummary from '@/components/calculator/ExchangeSummary';

interface FullCalculatorProps {
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

const FullCalculator: React.FC<FullCalculatorProps> = ({
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
    <div className={`bg-white rounded-3xl shadow-xl overflow-hidden ${className}`}>
      <div className="bg-primary-500 text-white p-4 flex items-center justify-center">
        <div className="flex items-center">
          <span className="text-lg font-semibold">1 {sourceCurrency}</span>
          <ArrowRight className="mx-3 h-5 w-5" />
          <span className="text-lg font-semibold">{exchangeRate.toFixed(2)} {targetCurrency}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-center mb-4">Send money to your loved ones</h3>
        <p className="text-center text-primary-600 text-sm mb-6 animate-pulse-subtle">
          Every transfer sends more than money—it sends your love, with industry-leading rates and zero hidden fees
        </p>
        
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
        
        <ExchangeSummary 
          sourceCurrency={sourceCurrency} 
          targetCurrency={targetCurrency} 
          rate={exchangeRate}
          className="mb-6"
        />
        
        <Button
          onClick={handleContinue}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl"
          size="lg"
          disabled={authLoading || isProcessing}
        >
          <div className="flex items-center justify-center">
            <Send className="mr-2 h-5 w-5" />
            {authLoading || isProcessing ? 'Processing...' : 'Send Money'}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default FullCalculator;
