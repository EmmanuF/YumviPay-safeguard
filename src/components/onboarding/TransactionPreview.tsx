
import React from 'react';

interface TransactionPreviewProps {
  transaction: {
    sendAmount: string;
    sourceCurrency: string;
    receiveAmount: string;
    targetCurrency: string;
  };
}

const TransactionPreview: React.FC<TransactionPreviewProps> = ({ transaction }) => {
  return (
    <div className="mb-6 p-4 bg-primary-50 rounded-xl">
      <h3 className="font-medium text-gray-900 mb-2">Your Transaction</h3>
      <p className="text-sm text-gray-600">
        You're sending {transaction.sendAmount} {transaction.sourceCurrency} 
        to receive approximately {transaction.receiveAmount} {transaction.targetCurrency}
      </p>
    </div>
  );
};

export default TransactionPreview;
