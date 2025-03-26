
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RepeatIcon } from 'lucide-react';
import { useCountries } from '@/hooks/useCountries';
import { Badge } from '@/components/ui/badge';

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
    isRecurring?: boolean;
    recurringFrequency?: string;
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

  const getRecurringFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Every 2 Weeks';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Every 3 Months';
      default: return 'Regularly';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Confirm Your Transfer</h2>
          {transactionData.isRecurring && (
            <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-200 flex items-center">
              <RepeatIcon size={14} className="mr-1" />
              {getRecurringFrequencyText(transactionData.recurringFrequency || 'monthly')}
            </Badge>
          )}
        </div>
        
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
                  Free
                </div>
                
                <div className="text-gray-500">Exchange rate:</div>
                <div className="font-medium text-right">
                  1 {transactionData.sourceCurrency} = {(transactionData.convertedAmount / transactionData.amount).toFixed(2)} {transactionData.targetCurrency}
                </div>
                
                {transactionData.isRecurring && (
                  <>
                    <div className="text-gray-500">Recurring:</div>
                    <div className="font-medium text-right text-primary-600">
                      {getRecurringFrequencyText(transactionData.recurringFrequency || 'monthly')}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="pt-2 border-t space-y-2">
              <h3 className="text-lg font-medium">Recipient</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Name:</div>
                <div className="font-medium text-right">{transactionData.recipientName || 'Not specified'}</div>
                
                <div className="text-gray-500">Contact:</div>
                <div className="font-medium text-right">{transactionData.recipient || 'Not specified'}</div>
                
                <div className="text-gray-500">Payment method:</div>
                <div className="font-medium text-right">
                  {transactionData.paymentMethod?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                  {transactionData.selectedProvider && ` (${transactionData.selectedProvider.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())})`}
                </div>
              </div>
            </div>
            
            {transactionData.isRecurring && (
              <div className="pt-2 border-t mt-4">
                <div className="bg-primary-50 rounded-lg p-3">
                  <div className="flex items-start">
                    <RepeatIcon className="text-primary-600 mt-0.5 mr-2 h-5 w-5" />
                    <div>
                      <h4 className="font-medium text-primary-800">Recurring Payment</h4>
                      <p className="text-sm text-primary-700 mt-1">
                        This payment will be sent {transactionData.recurringFrequency === 'weekly' ? 'every week' : 
                        transactionData.recurringFrequency === 'biweekly' ? 'every 2 weeks' : 
                        transactionData.recurringFrequency === 'monthly' ? 'every month' : 
                        'every 3 months'} until cancelled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              Processing...
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
