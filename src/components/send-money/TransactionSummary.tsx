
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Country } from '@/hooks/useCountries';

interface TransactionSummaryProps {
  amount: string;
  selectedCountryData: Country | undefined;
  selectedCountry: string;
  recipientName: string;
  recipient: string;
  selectedPaymentMethod: string;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  amount,
  selectedCountryData,
  selectedCountry,
  recipientName,
  recipient,
  selectedPaymentMethod,
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="p-4 bg-primary-50 border-primary-100">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <CheckCircle className="h-5 w-5 text-primary-500" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-primary-700">Transaction Summary</h4>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p>Amount: ${amount}</p>
              <p>Destination: {selectedCountryData?.name || selectedCountry}</p>
              <p>Recipient: {recipientName || 'Not specified'}</p>
              <p>Contact: {recipient || 'Not specified'}</p>
              {selectedPaymentMethod && selectedCountryData && (
                <p>Payment method: {
                  selectedCountryData.paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name || 
                  selectedPaymentMethod
                }</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TransactionSummary;
