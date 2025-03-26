
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Input } from "@/components/ui/input";

const ExchangeRateCalculatorStub: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("100");
  
  return (
    <div className="p-8 md:p-10 bg-white rounded-xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-left">Calculate Your Transfer</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="send-amount" className="block text-sm font-medium text-gray-700 mb-2">You Send</label>
            <Input
              id="send-amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-lg py-3"
            />
            <select className="w-full mt-3 text-sm border border-gray-300 rounded-md py-3 px-3 bg-white">
              <option value="USD">🇺🇸 United States (USD)</option>
              <option value="EUR">🇪🇺 Euro (EUR)</option>
              <option value="GBP">🇬🇧 United Kingdom (GBP)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="receive-amount" className="block text-sm font-medium text-gray-700 mb-2">They Receive</label>
            <Input
              id="receive-amount"
              type="text"
              value="63,500"
              readOnly
              className="w-full text-lg py-3"
            />
            <select className="w-full mt-3 text-sm border border-gray-300 rounded-md py-3 px-3 bg-white">
              <option value="XAF">🇨🇲 Cameroon (XAF)</option>
              <option value="NGN">🇳🇬 Nigeria (NGN)</option>
              <option value="GHS">🇬🇭 Ghana (GHS)</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-center text-gray-600 mt-2">
          Exchange Rate: 1 USD = 635 XAF
        </div>
        
        <Button 
          className="w-full py-6 text-base font-semibold mt-4" 
          onClick={() => navigate('/signup')}
          size="lg"
        >
          Send Now <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ExchangeRateCalculatorStub;
