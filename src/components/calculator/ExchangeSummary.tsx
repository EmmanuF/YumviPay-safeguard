
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
    <div className={`text-sm text-gray-500 ${className}`}>
      <div className="flex justify-between mb-2">
        <span>Exchange Rate:</span>
        <span className="font-medium">1 {sourceCurrency} = {rate} {targetCurrency}</span>
      </div>
      <div className="flex justify-between">
        <span>Transfer fees:</span>
        <span className="font-medium">0.00 {sourceCurrency}</span>
      </div>
    </div>
  );
};

export default ExchangeSummary;
