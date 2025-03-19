
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface RateDisplayProps {
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
  inline?: boolean;
}

const RateDisplay: React.FC<RateDisplayProps> = ({ 
  sourceCurrency, 
  targetCurrency, 
  rate,
  inline = false
}) => {
  if (inline) {
    return (
      <div className="flex items-center justify-center text-sm text-slate-500 mb-4">
        <span>1 {sourceCurrency}</span>
        <ArrowRight className="mx-2 h-4 w-4" />
        <span className="font-medium">{rate.toFixed(2)} {targetCurrency}</span>
      </div>
    );
  }

  return (
    <div className="bg-primary-500 text-white p-4 flex items-center justify-center">
      <div className="flex items-center">
        <span className="text-lg font-semibold">1 {sourceCurrency}</span>
        <ArrowRight className="mx-3 h-5 w-5" />
        <span className="text-lg font-semibold">{rate.toFixed(2)} {targetCurrency}</span>
      </div>
    </div>
  );
};

export default RateDisplay;
