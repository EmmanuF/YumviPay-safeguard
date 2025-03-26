
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const ExchangeRateCalculatorStub: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-left">Send Money to Cameroon</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">You send</div>
          <div className="font-medium">100 USD</div>
        </div>
        
        <div className="w-full h-0.5 bg-primary-100"></div>
        
        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">They receive</div>
          <div className="font-medium">63,500 XAF</div>
        </div>
        
        <div className="text-xs text-right text-muted-foreground">
          1 USD = 635 XAF
        </div>
        
        <Button 
          className="w-full mt-2" 
          onClick={() => navigate('/signup')}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default ExchangeRateCalculatorStub;
