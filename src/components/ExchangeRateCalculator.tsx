
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ExchangeRateCalculatorProps {
  className?: string;
}

const ExchangeRateCalculator: React.FC<ExchangeRateCalculatorProps> = ({ className }) => {
  const navigate = useNavigate();
  const [sendAmount, setSendAmount] = useState('100');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('NGN');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);

  // Calculate exchange rate (mock implementation)
  useEffect(() => {
    const calculateRate = () => {
      // Mock exchange rates (in a real app this would come from an API)
      const rates = {
        'USD-NGN': 1500,
        'USD-KES': 130,
        'USD-GHS': 13,
        'USD-ZAR': 18,
        'GBP-NGN': 1900,
        'EUR-NGN': 1650
      };
      
      const pair = `${sourceCurrency}-${targetCurrency}`;
      const rate = rates[pair] || 1500; // Default to NGN rate if pair not found
      
      const amount = parseFloat(sendAmount) || 0;
      setReceiveAmount((amount * rate).toLocaleString());
    };
    
    calculateRate();
  }, [sendAmount, sourceCurrency, targetCurrency]);

  const sourceCurrencies = ['USD', 'GBP', 'EUR'];
  const targetCurrencies = ['NGN', 'KES', 'GHS', 'ZAR'];

  return (
    <div className={`bg-white rounded-3xl shadow-xl overflow-hidden ${className}`}>
      <div className="bg-primary-900 text-white p-6">
        <h3 className="text-center text-lg">Exchange Rate</h3>
        <p className="text-center text-3xl font-bold mb-0">1 {sourceCurrency} = 1500 {targetCurrency}</p>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-center mb-4">Send money to your loved ones</h3>
        <p className="text-center text-gray-600 text-sm mb-6">
          We make sure more of your money goes to those you love, not to high service fees
        </p>
        
        {/* Amount sender sends */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <label className="text-sm text-gray-500 mb-1 block">You send</label>
          <div className="flex">
            <Input
              type="text"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              className="border-0 text-xl font-medium bg-transparent flex-1 focus-visible:ring-0"
            />
            <div className="relative">
              <button
                className="flex items-center bg-primary-50 rounded-lg px-4 py-2"
                onClick={() => setShowSourceDropdown(!showSourceDropdown)}
              >
                <span className="font-medium">{sourceCurrency}</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              
              {showSourceDropdown && (
                <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-lg z-10">
                  {sourceCurrencies.map((currency) => (
                    <button
                      key={currency}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                      onClick={() => {
                        setSourceCurrency(currency);
                        setShowSourceDropdown(false);
                      }}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Amount recipient receives */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <label className="text-sm text-gray-500 mb-1 block">They get</label>
          <div className="flex">
            <div className="text-xl font-medium flex-1">{receiveAmount}</div>
            <div className="relative">
              <button
                className="flex items-center bg-primary-50 rounded-lg px-4 py-2"
                onClick={() => setShowTargetDropdown(!showTargetDropdown)}
              >
                <span className="font-medium">{targetCurrency}</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              
              {showTargetDropdown && (
                <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-lg z-10">
                  {targetCurrencies.map((currency) => (
                    <button
                      key={currency}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                      onClick={() => {
                        setTargetCurrency(currency);
                        setShowTargetDropdown(false);
                      }}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mb-6">
          <div className="flex justify-between mb-2">
            <span>Exchange Rate:</span>
            <span className="font-medium">1 {sourceCurrency} = 1500 {targetCurrency}</span>
          </div>
          <div className="flex justify-between">
            <span>Transfer fees:</span>
            <span className="font-medium">0.00 {sourceCurrency}</span>
          </div>
        </div>
        
        <Button
          onClick={() => navigate('/send')}
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
