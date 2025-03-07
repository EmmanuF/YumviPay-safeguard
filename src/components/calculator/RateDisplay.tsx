
import React from 'react';

interface RateDisplayProps {
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
  className?: string;
}

const RateDisplay: React.FC<RateDisplayProps> = ({ 
  sourceCurrency, 
  targetCurrency, 
  rate,
  className = '' 
}) => {
  return (
    <div className={`bg-primary-500 text-white p-6 rounded-t-3xl shadow-md ${className}`}>
      <h3 className="text-center text-lg font-medium mb-1">Exchange Rate</h3>
      <p className="text-center text-3xl font-bold mb-0">
        1 {sourceCurrency} = {rate.toFixed(2)} {targetCurrency}
      </p>
    </div>
  );
};

export default RateDisplay;
