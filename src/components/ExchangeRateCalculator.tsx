
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurrencySelector from '@/components/calculator/CurrencySelector';
import AmountInput from '@/components/calculator/AmountInput';
import RateDisplay from '@/components/calculator/RateDisplay';
import ExchangeSummary from '@/components/calculator/ExchangeSummary';
import { useCountries } from '@/hooks/useCountries';
import { getExchangeRate } from '@/data/exchangeRates';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ExchangeRateCalculatorProps {
  className?: string;
  onContinue?: () => void;
}

const ExchangeRateCalculator: React.FC<ExchangeRateCalculatorProps> = ({ 
  className,
  onContinue 
}) => {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const { countries } = useCountries();
  const [sendAmount, setSendAmount] = useState('100');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('XAF'); // Set Cameroon's currency as default
  const [exchangeRate, setExchangeRate] = useState(610); // Updated default rate for USD to XAF

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
      // Get exchange rate from utility function
      const rate = getExchangeRate(sourceCurrency, targetCurrency);
      setExchangeRate(rate);
      
      const amount = parseFloat(sendAmount) || 0;
      setReceiveAmount((amount * rate).toLocaleString());
    };
    
    calculateRate();
  }, [sendAmount, sourceCurrency, targetCurrency]);

  const handleContinue = () => {
    // Store the current exchange information in localStorage for use in next steps
    const transactionData = {
      sourceCurrency,
      targetCurrency,
      sendAmount,
      receiveAmount: receiveAmount.replace(/,/g, ''),
      exchangeRate
    };
    
    // Save the transaction data to localStorage
    localStorage.setItem('pendingTransaction', JSON.stringify(transactionData));
    
    // If loading, wait (this prevents incorrect redirects during auth check)
    if (loading) return;
    
    // If user is already logged in, go straight to the send flow
    if (isLoggedIn) {
      navigate('/send');
    } else {
      // If not logged in, go to signin page instead of onboarding
      // since we have a separate signin/signup flow
      navigate('/signin', { state: { redirectTo: '/send' } });
    }
  };

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
          onClick={handleContinue}
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
