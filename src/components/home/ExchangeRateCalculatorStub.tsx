
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';

const ExchangeRateCalculatorStub: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-8 rounded-xl">
      <h3 className="text-xl font-semibold mb-6 text-center">Send Money to Cameroon</h3>
      
      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">You send</div>
          <div className="font-medium text-xl flex justify-between items-center">
            <span>100 USD</span>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">United States</span>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="bg-primary/10 p-2 rounded-full">
            <ArrowDown size={20} className="text-primary" />
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">They receive</div>
          <div className="font-medium text-xl flex justify-between items-center">
            <span>63,500 XAF</span>
            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">Cameroon</span>
          </div>
        </div>
        
        <div className="text-sm text-center text-muted-foreground">
          1 USD = 635 XAF
        </div>
        
        <Button 
          className="w-full mt-4" 
          onClick={() => navigate('/signup')}
          size="lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default ExchangeRateCalculatorStub;
