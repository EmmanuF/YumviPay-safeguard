
import React from 'react';
import ExchangeRateCalculator from '@/components/ExchangeRateCalculator';

interface InitialDataCalculatorProps {
  onContinue: () => void;
}

const InitialDataCalculator: React.FC<InitialDataCalculatorProps> = ({ onContinue }) => {
  return (
    <div className="p-4">
      <ExchangeRateCalculator 
        onContinue={onContinue}
        inlineMode={true}
      />
    </div>
  );
};

export default InitialDataCalculator;
