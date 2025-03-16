import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useCountries } from '@/hooks/useCountries';

export interface ConfirmationStepProps {
  transactionData: {
    amount: number;
    sourceCurrency: string;
    targetCurrency: string;
    convertedAmount: number;
    recipient: string | null;
    recipientName?: string;
    paymentMethod: string | null;
    selectedProvider?: string;
  };
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  transactionData,
  onConfirm,
  onBack,
  isSubmitting = false
}) => {
  const { getCountryByCode } = useCountries();
  const selectedCountryData = getCountryByCode(transactionData.targetCurrency);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mb-4">Confirm Your Transfer</h2>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Transfer Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Amount:</div>
                <div className="font-medium text-right">
                  {formatCurrency(transactionData.amount, transactionData.sourceCurrency)}
                </div>
                
                <div className="text-gray-500">Recipient gets:</div>
                <div className="font-medium text-right">
                  {formatCurrency(transactionData.convertedAmount, transactionData.targetCurrency)}
                </div>
                
                <div className="text-gray-500">Fee:</div>
                <div className="font-medium text-right text-green-600">
                  {formatCurrency(0, transactionData.sourceCurrency)}
                </div>
                
                <div className="text-gray-500">Exchange rate:</div>
                <div className="font-medium text-right">
                  1 {transactionData.sourceCurrency} = {(transactionData.convertedAmount / transactionData.amount).toFixed(2)} {transactionData.targetCurrency}
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t space-y-2">
              <h3 className="text-lg font-medium">Recipient</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Name:</div>
                <div className="font-medium text-right">{transactionData.recipientName || 'Not specified'}</div>
                
                <div className="text-gray-500">Contact:</div>
                <div className="font-medium text-right">{transactionData.recipient || 'Not specified'}</div>
                
                <div className="text-gray-500">Country:</div>
                <div className="font-medium text-right">{selectedCountryData?.name || transactionData.targetCurrency}</div>
              </div>
            </div>
            
            <div className="pt-2 border-t space-y-2">
              <h3 className="text-lg font-medium">Payment Method</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Method:</div>
                <div className="font-medium text-right">
                  {selectedCountryData?.paymentMethods.find(pm => pm.id === transactionData.paymentMethod)?.name || 
                   transactionData.paymentMethod || 'Not specified'}
                </div>
                
                {transactionData.selectedProvider && (
                  <>
                    <div className="text-gray-500">Provider:</div>
                    <div className="font-medium text-right">{transactionData.selectedProvider}</div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="pt-4 flex space-x-3">
        <Button 
          variant="outline"
          onClick={onBack} 
          className="w-1/2" 
          size="lg"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          onClick={onConfirm} 
          className="w-1/2" 
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            'Confirm & Pay'
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationStep;
