
import React from 'react';

interface ExchangeSummaryProps {
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
  className?: string;
}

const ExchangeSummary: React.FC<ExchangeSummaryProps> = ({ 
  sourceCurrency, 
  targetCurrency, 
  rate,
  className = '' 
}) => {
  return (
    <div className={`text-sm text-gray-700 ${className}`}>
      <div className="flex justify-between mb-2">
        <span>Exchange Rate:</span>
        <span className="font-medium">1 {sourceCurrency} = {rate.toFixed(2)} {targetCurrency}</span>
      </div>
      <div className="flex justify-between">
        <span>Transfer fees:</span>
        <span className="font-medium text-green-600">Free</span>
      </div>
    </div>
  );
};

export default ExchangeSummary;
