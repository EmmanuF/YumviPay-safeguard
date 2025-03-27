
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, CreditCard, Building, ChevronDown, ChevronUp, Check, AlertTriangle, ArrowRight, Sparkles, Info, Clock } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCountries } from '@/hooks/useCountries';
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import CountryPaymentMethods from './payment/CountryPaymentMethods';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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
  const countryCode = transactionData?.targetCountry || 'CM';
  
  // Hard-coded payment methods for demo (normally would come from API)
  const paymentMethods = [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      description: 'Fast transfers directly to mobile wallets',
      providers: [
        { id: 'mtn_mobile_money', name: 'MTN Mobile Money', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/New-mtn-logo.svg/180px-New-mtn-logo.svg.png' }, 
        { id: 'orange_money', name: 'Orange Money', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Orange_logo.svg/250px-Orange_logo.svg.png' }, 
        { id: 'yoomee_money', name: 'YooMee Money', logo: '' }
      ]
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Transfer to bank accounts',
      providers: [
        { id: 'ecobank', name: 'Ecobank', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Ecobank_Image.jpg/220px-Ecobank_Image.jpg' }, 
        { id: 'afriland', name: 'Afriland First Bank', logo: '' }, 
        { id: 'bgfi', name: 'BGFI Bank', logo: '' }
      ]
    },
    {
      id: 'card',
      name: 'Card Payment',
      description: 'Pay with credit or debit card',
      providers: [
        { id: 'visa', name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/800px-Visa_Inc._logo.svg.png' }, 
        { id: 'mastercard', name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/800px-Mastercard-logo.svg.png' }
      ]
    }
  ];

  // Animation variants with staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 24 
      }
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

  // Handle method selection and provider selection
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setSelectedProvider(''); // Reset provider when method changes
  };

  // Handle method and provider selection via CountryPaymentMethods
  const handlePaymentSelect = (methodId: string, providerId: string) => {
    console.log(`Selected method: ${methodId}, provider: ${providerId}`);
    setSelectedMethod(methodId);
    setSelectedProvider(providerId);
  };

  // Toggle recurring payment option
  const handleRecurringToggle = (checked: boolean) => {
    setIsRecurring(checked);
    setIsRecurringExpanded(checked);
  };

  // Check if next button should be enabled
  const isNextDisabled = !selectedMethod || !selectedProvider || !termsAccepted;

  // Calculate estimated delivery based on method
  const getEstimatedDelivery = () => {
    if (selectedMethod === 'mobile_money') return 'Instant - 10 minutes';
    if (selectedMethod === 'bank_transfer') return '1-3 business days';
    if (selectedMethod === 'card') return 'Instant - 2 hours';
    return 'Varies by method';
  };

  // Format transaction fee
  const getTransactionFee = () => {
    if (selectedMethod === 'mobile_money') return '2.5%';
    if (selectedMethod === 'bank_transfer') return '1.75%';
    if (selectedMethod === 'card') return '3.2% + $0.30';
    return 'Varies by method';
  };

  // Get the provider name from ID
  const getProviderName = (providerId: string) => {
    for (const method of paymentMethods) {
      const provider = method.providers?.find(p => p.id === providerId);
      if (provider) return provider.name;
    }
    return providerId;
  };

  // Get provider logo URL
  const getProviderLogo = (providerId: string) => {
    for (const method of paymentMethods) {
      const provider = method.providers?.find(p => p.id === providerId);
      if (provider && provider.logo) return provider.logo;
    }
    return undefined;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="glass-effect border-primary-100/30 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <motion.h2 
              className="text-2xl font-bold text-center text-gradient-primary mb-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.1 } }}
            >
              Choose Payment Method
            </motion.h2>
            <motion.p 
              className="text-center text-muted-foreground mb-8"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            >
              Select how you'd like to pay for this transfer
            </motion.p>

            {/* Country-specific payment methods with enhanced spacing and visuals */}
            <motion.div 
              variants={itemVariants}
              className="mb-8"
            >
              <CountryPaymentMethods
                countryCode={countryCode}
                selectedPaymentMethod={selectedMethod}
                selectedProvider={selectedProvider}
                onSelect={handlePaymentSelect}
              />
            </motion.div>

            {/* Payment Method Details - only shown when method and provider selected */}
            {selectedMethod && selectedProvider && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="bg-primary-50/30 backdrop-blur-sm rounded-xl p-5 border border-primary-100/30 mb-6"
              >
                <h3 className="font-medium text-primary-700 mb-3 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary-500" />
                  Payment Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center p-3 bg-white/60 backdrop-blur-sm rounded-lg">
                    <div className="mr-3 bg-primary-100/60 p-2 rounded-full">
                      {getPaymentIcon(selectedMethod)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium text-primary-800">{paymentMethods.find(m => m.id === selectedMethod)?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-white/60 backdrop-blur-sm rounded-lg">
                    <div className="mr-3 bg-blue-100/60 p-2 rounded-full overflow-hidden">
                      {getProviderLogo(selectedProvider) ? (
                        <img 
                          src={getProviderLogo(selectedProvider)} 
                          alt={getProviderName(selectedProvider)}
                          className="h-6 w-6 object-contain"
                        />
                      ) : (
                        <Building className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Provider</p>
                      <p className="font-medium text-blue-800">{getProviderName(selectedProvider)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-white/60 backdrop-blur-sm rounded-lg">
                    <div className="mr-3 bg-amber-100/60 p-2 rounded-full">
                      <Clock className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="font-medium text-amber-800">{getEstimatedDelivery()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-white/60 backdrop-blur-sm rounded-lg">
                    <div className="mr-3 bg-green-100/60 p-2 rounded-full">
                      <Badge className="h-6 w-6 text-green-500 p-1">$</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transaction Fee</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="font-medium text-green-800 flex items-center">
                              {getTransactionFee()}
                              <Info className="h-4 w-4 ml-1 text-gray-400" />
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              This fee is charged by the payment provider and may vary based on your location and transaction amount.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recurring Payment Option - with premium styling */}
            <motion.div 
              className="mb-6"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 flex items-center justify-between"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div className="bg-secondary-100 p-2 rounded-full mr-3">
                    <Sparkles className="h-5 w-5 text-secondary-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-600">Make this a recurring payment</h3>
                    <p className="text-sm text-gray-500">Schedule automatic payments</p>
                  </div>
                </div>
                <Switch
                  checked={isRecurring}
                  onCheckedChange={handleRecurringToggle}
                  className="data-[state=checked]:bg-secondary"
                />
              </motion.div>

              {/* Recurring options - expanded when toggle is on */}
              <AnimatePresence>
                {isRecurringExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-secondary-50/60 backdrop-blur-sm rounded-xl p-5 border border-secondary-100/60 mt-3"
                  >
                    <h4 className="font-medium text-secondary-700 mb-3 flex items-center">
                      <ChevronDown className="h-4 w-4 mr-1 text-secondary" />
                      Payment Frequency
                    </h4>
                    
                    <Select 
                      value={recurringFrequency} 
                      onValueChange={setRecurringFrequency}
                    >
                      <SelectTrigger className="w-full bg-white/80 border-secondary-200/60 focus:ring-secondary-500/30">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Every 3 Months</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <p className="text-sm text-gray-600 mt-3 bg-white/40 p-3 rounded-lg border border-secondary-100/20">
                      <Info className="h-4 w-4 inline-block mr-1 text-secondary-400" />
                      You can cancel recurring payments anytime from your transaction history.
                      The payment will be processed automatically on the same day each period.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Terms and Conditions Confirmation - premium design */}
            <motion.div 
              className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200/80 rounded-xl p-5 mb-6"
              variants={itemVariants}
            >
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
                        By proceeding, you agree to our Terms of Service and acknowledge our Privacy Policy.
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            </motion.div>

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
