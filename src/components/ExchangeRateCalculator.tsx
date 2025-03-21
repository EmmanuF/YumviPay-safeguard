
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateExchange } from '@/utils/exchangeRate';
import { useDebounce } from '@/hooks/useDebounce';
import { useCurrencies } from '@/hooks/useCurrencies';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import CurrencySelector from '@/components/calculator/CurrencySelector';

export interface ExchangeRateCalculatorProps {
  className?: string;
  onContinue?: () => void;
  inlineMode?: boolean;
}

const ExchangeRateCalculator: React.FC<ExchangeRateCalculatorProps> = ({ 
  className,
  onContinue,
  inlineMode = false
}) => {
  const [sourceAmount, setSourceAmount] = useState<number>(1);
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [sourceCurrency, setSourceCurrency] = useState<string>('USD');
  const [targetCurrency, setTargetCurrency] = useState<string>('EUR');
  const debouncedSourceAmount = useDebounce(sourceAmount, 500);
  const { toast } = useToast();
  
  const { 
    currencies: sourceCurrencies, 
    isLoading: isLoadingSourceCurrencies 
  } = useCurrencies({ type: 'source' });
  
  const { 
    currencies: targetCurrencies, 
    isLoading: isLoadingTargetCurrencies 
  } = useCurrencies({ type: 'target' });
  
  const { 
    exchangeRate, 
    isLoading: isLoadingExchangeRate, 
    error 
  } = useExchangeRate(sourceCurrency, targetCurrency);
  
  const sourceCurrencyOptions = sourceCurrencies || [];
  const targetCurrencyOptions = targetCurrencies || [];
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  useEffect(() => {
    if (exchangeRate) {
      setTargetAmount(calculateExchange(debouncedSourceAmount, exchangeRate));
    }
  }, [debouncedSourceAmount, exchangeRate]);
  
  const handleSourceAmountChange = (value: string) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setSourceAmount(parsedValue);
    } else {
      setSourceAmount(0);
    }
  };
  
  const handleTargetAmountChange = (value: string) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setTargetAmount(parsedValue);
    } else {
      setTargetAmount(0);
    }
  };
  
  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
  };
  
  return (
    <div className={`glass-card p-4 rounded-xl mb-6 ${className || ''}`}>
      <h2 className="text-lg font-semibold mb-4">Exchange Rate Calculator</h2>
      
      <div className="flex justify-between items-center gap-2 mb-4">
        <CurrencySelector
          label="From"
          value={sourceCurrency}
          onChange={setSourceCurrency}
          options={sourceCurrencyOptions}
          type="source"
        />
        
        <div className="flex flex-col space-y-1 w-1/2">
          <Label htmlFor="sourceAmount">Amount</Label>
          <Input
            type="number"
            id="sourceAmount"
            placeholder="Enter amount"
            value={sourceAmount.toString()}
            onChange={(e) => handleSourceAmountChange(e.target.value)}
            disabled={isLoadingExchangeRate}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center gap-2 mb-4">
        <CurrencySelector
          label="To"
          value={targetCurrency}
          onChange={setTargetCurrency}
          options={targetCurrencyOptions}
          type="target"
        />
        
        <div className="flex flex-col space-y-1 w-1/2">
          <Label htmlFor="targetAmount">Amount</Label>
          <Input
            type="number"
            id="targetAmount"
            placeholder="Enter amount"
            value={targetAmount.toString()}
            onChange={(e) => handleTargetAmountChange(e.target.value)}
            disabled={isLoadingExchangeRate}
          />
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        {isLoadingExchangeRate ? (
          <Skeleton className="w-[200px] h-[20px] mx-auto" />
        ) : (
          <>
            1 {sourceCurrency} = {exchangeRate?.toFixed(4) || '0.0000'} {targetCurrency}
          </>
        )}
      </div>
      
      {inlineMode && onContinue && (
        <div className="mt-4">
          <button 
            onClick={handleContinue}
            className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary/90 transition"
            disabled={isLoadingExchangeRate}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default ExchangeRateCalculator;
