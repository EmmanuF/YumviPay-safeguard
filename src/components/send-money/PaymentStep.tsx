
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, CreditCard, Building, ChevronDown, ChevronUp, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCountries } from '@/hooks/useCountries';
import PaymentStepNavigation from './payment/PaymentStepNavigation';

interface PaymentStepProps {
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

// Helper function to get icon component based on payment method
const getPaymentIcon = (method: string) => {
  switch (method.toLowerCase()) {
    case 'mobile_money':
    case 'mtn_mobile_money':
    case 'orange_money':
      return <Wallet className="h-6 w-6 text-primary" />;
    case 'bank_transfer':
    case 'ecobank':
    case 'afriland':
      return <Building className="h-6 w-6 text-blue-500" />;
    case 'card':
    case 'credit_card':
    case 'visa':
    case 'mastercard':
      return <CreditCard className="h-6 w-6 text-purple-600" />;
    default:
      return <Wallet className="h-6 w-6 text-gray-500" />;
  }
};

const PaymentStep: React.FC<PaymentStepProps> = ({
  transactionData,
  updateTransactionData,
  onNext,
  onBack,
  isSubmitting = false
}) => {
  const { getCountryByCode } = useCountries();
  const [selectedMethod, setSelectedMethod] = useState<string>(transactionData?.paymentMethod || '');
  const [selectedProvider, setSelectedProvider] = useState<string>(transactionData?.selectedProvider || '');
  const [isRecurring, setIsRecurring] = useState<boolean>(transactionData?.isRecurring || false);
  const [recurringFrequency, setRecurringFrequency] = useState<string>(transactionData?.recurringFrequency || 'monthly');
  const [isRecurringExpanded, setIsRecurringExpanded] = useState<boolean>(isRecurring);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(transactionData?.termsAccepted || false);
  
  // Hard-coded payment methods for demo (normally would come from API)
  const paymentMethods = [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      description: 'Fast transfers directly to mobile wallets',
      providers: ['MTN Mobile Money', 'Orange Money', 'YoMoney']
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Transfer to bank accounts',
      providers: ['Ecobank', 'Afriland First Bank', 'BGFI Bank']
    },
    {
      id: 'card',
      name: 'Card Payment',
      description: 'Pay with credit or debit card',
      providers: ['Visa', 'Mastercard']
    }
  ];

  // Animation variants
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

  // Update transaction data when selections change
  useEffect(() => {
    if (selectedMethod || selectedProvider || isRecurring) {
      updateTransactionData({
        paymentMethod: selectedMethod,
        selectedProvider: selectedProvider,
        isRecurring: isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : undefined,
        termsAccepted: termsAccepted
      });
    }
  }, [selectedMethod, selectedProvider, isRecurring, recurringFrequency, termsAccepted, updateTransactionData]);

  // Handle method selection
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setSelectedProvider(''); // Reset provider when method changes
  };

  // Handle provider selection
  const handleProviderSelect = (provider: string) => {
    setSelectedProvider(provider);
  };

  // Toggle recurring payment option
  const handleRecurringToggle = (checked: boolean) => {
    setIsRecurring(checked);
    setIsRecurringExpanded(checked);
  };

  // Check if next button should be enabled
  const isNextDisabled = !selectedMethod || !selectedProvider || !termsAccepted;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg border border-secondary-100/30">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-center text-indigo-800 mb-6">
              Choose Payment Method
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Select how you'd like to pay for this transfer
            </p>

            {/* Payment Methods */}
            <div className="space-y-4 mb-6">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  className={`p-4 rounded-xl border ${selectedMethod === method.id 
                    ? 'border-primary bg-primary-50/30 shadow-md' 
                    : 'border-gray-200 bg-white'
                  } transition-all duration-200 hover:shadow-md cursor-pointer`}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      {getPaymentIcon(method.id)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-indigo-700">{method.name}</h3>
                      <p className="text-gray-600 text-sm">{method.description}</p>
                    </div>
                    <div className="h-5 w-5 rounded-full border border-primary flex items-center justify-center">
                      {selectedMethod === method.id && (
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>

                  {/* Provider selection - shown only when method is selected */}
                  {selectedMethod === method.id && method.providers && (
                    <div className="mt-4 pl-14">
                      <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Select Provider
                      </Label>
                      <Select 
                        value={selectedProvider} 
                        onValueChange={handleProviderSelect}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Choose provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {method.providers.map((provider) => (
                            <SelectItem key={provider} value={provider}>
                              {provider}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recurring Payment Option */}
            <div className="mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium text-indigo-600">Make this a recurring payment</h3>
                  <p className="text-sm text-gray-500">Schedule automatic payments</p>
                </div>
                <Switch
                  checked={isRecurring}
                  onCheckedChange={handleRecurringToggle}
                  className="data-[state=checked]:bg-secondary"
                />
              </div>

              {/* Recurring options - expanded when toggle is on */}
              {isRecurringExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-secondary-50/40 rounded-xl p-4 border border-secondary-100"
                >
                  <h4 className="font-medium text-secondary-700 mb-2 flex items-center">
                    <ChevronDown className="h-4 w-4 mr-1 text-secondary" />
                    Payment Frequency
                  </h4>
                  
                  <Select 
                    value={recurringFrequency} 
                    onValueChange={setRecurringFrequency}
                  >
                    <SelectTrigger className="w-full bg-white border-secondary-200">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Every 3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    You can cancel recurring payments anytime from your transaction history.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Terms and Conditions Confirmation */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">Confirm Details</h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    Please double-check that all details are correct before proceeding.
                  </p>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-yellow-500 mt-1"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <Label 
                      htmlFor="terms" 
                      className="text-sm font-normal text-yellow-800 cursor-pointer"
                    >
                      I confirm that all recipient details are correct and I authorize this payment.
                      <div className="text-xs text-yellow-600 mt-1">
                        By proceeding, you agree to our Terms of Service.
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <PaymentStepNavigation
              onNext={onNext}
              onBack={onBack}
              isNextDisabled={isNextDisabled}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStep;
