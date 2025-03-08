
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurrencySelector from '@/components/calculator/CurrencySelector';
import AmountInput from '@/components/calculator/AmountInput';
import RateDisplay from '@/components/calculator/RateDisplay';
import ExchangeSummary from '@/components/calculator/ExchangeSummary';
import { useCountries } from '@/hooks/useCountries';

interface ExchangeRateCalculatorProps {
  className?: string;
}

const ExchangeRateCalculator: React.FC<ExchangeRateCalculatorProps> = ({ className }) => {
  const navigate = useNavigate();
  const { countries } = useCountries();
  const [sendAmount, setSendAmount] = useState('100');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('NGN');
  const [exchangeRate, setExchangeRate] = useState(1500);

  // Get unique currencies from countries
  const sourceCurrencies = Array.from(new Set(
    countries
      .filter(country => country.isSendingEnabled)
      .map(country => country.currency)
  ));
  
  const targetCurrencies = Array.from(new Set(
    countries
      .filter(country => country.isReceivingEnabled)
      .map(country => country.currency)
  ));

  useEffect(() => {
    const calculateRate = () => {
      const rates: Record<string, number> = {
        'USD-NGN': 1500,
        'USD-KES': 130,
        'USD-GHS': 13,
        'USD-ZAR': 18,
        'USD-UGX': 3800,
        'USD-TZS': 2500,
        'USD-RWF': 1200,
        'USD-ETB': 57,
        'USD-XOF': 610,
        'USD-XAF': 610,
        'USD-CDF': 2500,
        'GBP-NGN': 1900,
        'EUR-NGN': 1650,
        'CAD-NGN': 1100,
        'AUD-NGN': 980,
        'JPY-NGN': 10,
        'GBP-KES': 165,
        'EUR-KES': 143,
        'CAD-KES': 95,
        'GBP-GHS': 16.5,
        'EUR-GHS': 14.3,
        'CAD-GHS': 9.5,
        'GBP-ZAR': 23,
        'EUR-ZAR': 19.8,
        'CAD-ZAR': 13.5,
        'EUR-XOF': 655,
        'GBP-XOF': 760,
        'EUR-XAF': 655,
        'GBP-XAF': 760,
        'EUR-CDF': 2200,
        'GBP-CDF': 2600,
      };
      
      const pair = `${sourceCurrency}-${targetCurrency}`;
      // Default to USD-NGN rate if specific pair not found
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
