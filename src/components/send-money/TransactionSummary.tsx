
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Country } from '@/hooks/useCountries';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/formatUtils';
import { getProviderById } from '@/data/cameroonPaymentProviders';

interface TransactionSummaryProps {
  amount: string;
  recipientName?: string;
  recipient?: string;
  selectedCountryData?: Country;
  selectedCountry: string;
  selectedPaymentMethod: string | null;
  selectedProvider?: string;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  amount,
  recipientName,
  recipient,
  selectedCountryData,
  selectedCountry,
  selectedPaymentMethod,
  selectedProvider,
}) => {
  // Convert amount to number
  const amountValue = parseFloat(amount) || 0;
  
  // Get payment method details
  const paymentMethod = selectedCountryData?.paymentMethods.find(
    method => method.id === selectedPaymentMethod
  );

  // Get provider details if available
  const methodId = selectedPaymentMethod || '';
  const providerDetails = selectedProvider ? getProviderById(methodId, selectedProvider) : undefined;
  
  const sourceCurrency = 'USD';
  const targetCurrency = selectedCountryData?.currency || 'XAF';
  
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
    >
      <h3 className="font-medium mb-3">Transaction Summary</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Amount</span>
          <span className="font-medium">{formatCurrency(amountValue, sourceCurrency)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500">Exchange Rate</span>
          <span className="font-medium">1 {sourceCurrency} = 610 {targetCurrency}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500">Recipient Gets</span>
          <span className="font-medium">{formatCurrency(amountValue * 610, targetCurrency)}</span>
        </div>
        
        {recipientName && (
          <div className="flex justify-between">
            <span className="text-gray-500">Recipient</span>
            <span className="font-medium">{recipientName}</span>
          </div>
        )}
        
        {recipient && (
          <div className="flex justify-between">
            <span className="text-gray-500">Phone/Account</span>
            <span className="font-medium">{recipient}</span>
          </div>
        )}
        
        {paymentMethod && (
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium">{paymentMethod.name}</span>
          </div>
        )}

        {providerDetails && (
          <div className="flex justify-between">
            <span className="text-gray-500">Provider</span>
            <span className="font-medium">{providerDetails.name}</span>
          </div>
        )}
        
        <Separator className="my-2" />
        
        <div className="flex justify-between font-medium">
          <span>Total Fee</span>
          <span className="text-green-600">Free</span>
        </div>
        
        <div className="flex justify-between text-primary-800 font-bold">
          <span>Total to Pay</span>
          <span>{formatCurrency(amountValue, sourceCurrency)}</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-start gap-2 p-2 bg-green-50 rounded-lg">
        <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
        <p className="text-xs text-green-800">
          Your transaction is secure and protected. Funds typically arrive within {paymentMethod?.processingTime || "1-2 business days"}.
        </p>
      </div>
    </motion.div>
  );
};

export default TransactionSummary;
