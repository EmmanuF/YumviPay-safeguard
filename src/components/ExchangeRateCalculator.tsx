
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurrencySelector from '@/components/calculator/CurrencySelector';
import AmountInput from '@/components/calculator/AmountInput';
import RateDisplay from '@/components/calculator/RateDisplay';
import ExchangeSummary from '@/components/calculator/ExchangeSummary';

interface ExchangeRateCalculatorProps {
  className?: string;
}

const ExchangeRateCalculator: React.FC<ExchangeRateCalculatorProps> = ({ className }) => {
  const navigate = useNavigate();
  const [sendAmount, setSendAmount] = useState('100');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('NGN');
  const [exchangeRate, setExchangeRate] = useState(1500);

  // Updated to include currency codes associated with countries from useCountries
  const sourceCurrencies = ['USD', 'GBP', 'EUR'];
  const targetCurrencies = ['NGN', 'KES', 'GHS', 'ZAR'];

  useEffect(() => {
    const calculateRate = () => {
      const rates = {
        'USD-NGN': 1500,
        'USD-KES': 130,
        'USD-GHS': 13,
        'USD-ZAR': 18,
        'GBP-NGN': 1900,
        'EUR-NGN': 1650
      };
      
      const pair = `${sourceCurrency}-${targetCurrency}`;
      const rate = rates[pair] || 1500;
      setExchangeRate(rate);
      
      const amount = parseFloat(sendAmount) || 0;
      setReceiveAmount((amount * rate).toLocaleString());
    };
    
    calculateRate();
  }, [sendAmount, sourceCurrency, targetCurrency]);

  return (
    <div className={`bg-white rounded-3xl shadow-xl overflow-hidden ${className}`}>
      <RateDisplay 
        sourceCurrency={sourceCurrency} 
        targetCurrency={targetCurrency} 
        rate={exchangeRate} 
      />
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-center mb-4">Send money to your loved ones</h3>
        <p className="text-center text-gray-600 text-sm mb-6">
          We make sure more of your money goes to those you love, not to high service fees
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
          onClick={() => navigate('/onboarding')}
          className="w-full bg-primary-500 hover:bg-primary-600 py-3 rounded-xl"
          size="lg"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ExchangeRateCalculator;
