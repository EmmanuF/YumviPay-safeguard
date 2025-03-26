
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCountries } from '@/hooks/useCountries';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from '@/lib/utils';
import PaymentMethodCard from '@/components/PaymentMethodCard';
import { Building, Wallet, CreditCard, Contact2, ChevronRight, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { kadoRedirectService } from '@/services/kado/redirect';
import { getTransactionData } from '@/utils/transactionDataStore';
import { motion } from 'framer-motion';
import SendMoneyLayout from './SendMoneyLayout';
import NameMatchConfirmation from './payment/NameMatchConfirmation';

const formSchema = z.object({
  country: z.string().min(1, {
    message: "Country is required.",
  }),
  paymentMethod: z.string().min(1, {
    message: "Payment method is required.",
  }),
  recipientName: z.string().min(1, {
    message: "Recipient name is required.",
  }),
  recipientContact: z.string().min(1, {
    message: "Recipient contact is required.",
  }),
});

interface SendMoneyContainerProps {
  isLoading: boolean;
  needsInitialData: boolean;
  error: string | Error | null;
  defaultCountryCode?: string | null;
  onInitialDataContinue?: () => void;
}

const SendMoneyContainer: React.FC<SendMoneyContainerProps> = ({
  isLoading,
  needsInitialData,
  error,
  defaultCountryCode,
  onInitialDataContinue
}) => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState(defaultCountryCode || '');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const { countries, isLoading: countriesLoading } = useCountries();
  const { paymentMethods, isLoading: paymentMethodsLoading } = usePaymentMethods(selectedCountry);
  const [transactionId, setTransactionId] = useState('');
  const [isDetailsConfirmed, setIsDetailsConfirmed] = useState(false);
  const [showConfirmationError, setShowConfirmationError] = useState(false);
  
  // Get the transaction data that was already set in the previous step
  const storedTransactionData = getTransactionData();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: defaultCountryCode || '',
      paymentMethod: '',
      recipientName: '',
      recipientContact: '',
    },
  });

  useEffect(() => {
    if (defaultCountryCode) {
      setSelectedCountry(defaultCountryCode);
      form.setValue('country', defaultCountryCode);
    }
  }, [defaultCountryCode, form]);

  // If we're still in the initial data collection step, just call the continue handler
  useEffect(() => {
    if (needsInitialData && onInitialDataContinue && storedTransactionData) {
      // Data is already available, no need to show the calculator again
      onInitialDataContinue();
    }
  }, [needsInitialData, onInitialDataContinue, storedTransactionData]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    form.setValue('country', value);
    setSelectedPaymentMethod('');
    form.setValue('paymentMethod', '');
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    form.setValue('paymentMethod', method);
  };

  const handleConfirmationChange = (checked: boolean) => {
    setIsDetailsConfirmed(checked);
    if (checked) {
      setShowConfirmationError(false);
    }
  };

  const paymentMethodIcon = (method: string) => {
    switch (method) {
      case 'mobile_money':
        return <Wallet className="h-7 w-7 text-green-500" />;
      case 'bank_transfer':
        return <Building className="h-7 w-7 text-blue-500" />;
      case 'credit_card':
        return <CreditCard className="h-7 w-7 text-purple-500" />;
      default:
        return <Contact2 className="h-7 w-7 text-gray-500" />;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isDetailsConfirmed) {
      setShowConfirmationError(true);
      
      toast({
        title: t('validation.attention_required'),
        description: t('validation.confirm_recipient_details'),
        variant: "destructive",
      });
      
      return;
    }
    
    try {
      // Generate a unique transaction ID
      const newTransactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setTransactionId(newTransactionId);

      // Get the amount and currency information from the stored transaction data
      const amount = storedTransactionData?.amount?.toString() || "0";
      
      // Store the transaction details in localStorage
      localStorage.setItem('pendingTransaction', JSON.stringify({
        ...values,
        amount,
        transactionId: newTransactionId,
        sourceCurrency: storedTransactionData?.sourceCurrency || 'USD',
        targetCurrency: storedTransactionData?.targetCurrency || 'XAF',
        convertedAmount: storedTransactionData?.convertedAmount || 0,
        exchangeRate: storedTransactionData?.exchangeRate || 610
      }));

      // Redirect to Kado
      await kadoRedirectService.redirectToKado({
        amount,
        recipientName: values.recipientName,
        recipientContact: values.recipientContact,
        country: values.country,
        paymentMethod: values.paymentMethod,
        transactionId: newTransactionId,
        returnUrl: `${window.location.origin}/transaction/${newTransactionId}`,
      });

      // Navigate to transaction status page
      navigate(`/transaction/${newTransactionId}`);
    } catch (error: any) {
      console.error("Kado redirect error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  // If we're still loading initial data, but don't have it yet, show minimal UI
  if (needsInitialData && !storedTransactionData) {
    return (
      <SendMoneyLayout>
        <Card className="mt-4 border-none shadow-lg">
          <CardHeader>
            <CardTitle>{t('sendMoney.pleaseWait')}</CardTitle>
            <CardDescription>{t('sendMoney.loadingData')}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </SendMoneyLayout>
    );
  }

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

  // Display transaction form with pre-filled data
  return (
    <SendMoneyLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-lg overflow-hidden card-accent">
            <CardHeader>
              <CardTitle>{t('transaction.send_money')}</CardTitle>
              <CardDescription>{t('sendMoney.description')}</CardDescription>
              {storedTransactionData && (
                <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{t('transaction.amount')}</p>
                      <p className="text-xl font-semibold text-primary-700">{storedTransactionData.amount} {storedTransactionData.sourceCurrency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{t('transaction.recipient_gets')}</p>
                      <p className="text-lg font-medium text-primary-600">{storedTransactionData.convertedAmount} {storedTransactionData.targetCurrency}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="warning-box">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <p className="text-sm text-amber-800">{error.toString()}</p>
                  </div>
                )}

                <motion.div variants={itemVariants} className="form-field">
                  <Label htmlFor="country" className="form-label">
                    {t('sendMoney.countryLabel')} <span className="required-indicator">*</span>
                  </Label>
                  <Select onValueChange={handleCountryChange} defaultValue={defaultCountryCode || ''}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder={t('sendMoney.countryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {countriesLoading ? (
                        <SelectItem value="loading" disabled>Loading countries...</SelectItem>
                      ) : (
                        countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <div className="flex items-center">
                              <span className="mr-2">{country.emoji}</span> 
                              {country.name}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.country && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.country.message}</p>
                  )}
                  <p className="form-helper">
                    <Info className="inline h-3 w-3 mr-1" />
                    Select the country where your recipient is located
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="form-field">
                  <Label className="form-label">
                    {t('transaction.payment_method')} <span className="required-indicator">*</span>
                  </Label>
                  {paymentMethodsLoading ? (
                    <div className="flex justify-center p-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {paymentMethods.map((method) => (
                        <div 
                          key={method.id}
                          className={`payment-card ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                          onClick={() => handlePaymentMethodSelect(method.id)}
                        >
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${selectedPaymentMethod === method.id ? 'bg-primary-100' : 'bg-gray-100'}`}>
                              {paymentMethodIcon(method.id)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{method.name}</h3>
                              <p className="text-sm text-gray-500">
                                {method.id === 'mobile_money' ? t('payment.mobile_money') : t('payment.bank_transfer')}
                              </p>
                            </div>
                            <ChevronRight className={`w-5 h-5 ${selectedPaymentMethod === method.id ? 'text-primary-500' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {form.formState.errors.paymentMethod && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.paymentMethod.message}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="form-field">
                  <Label htmlFor="recipientName" className="form-label">
                    {t('transaction.recipient')} <span className="required-indicator">*</span>
                  </Label>
                  <Input 
                    id="recipientName" 
                    placeholder={t('sendMoney.recipientNamePlaceholder')} 
                    {...form.register('recipientName')} 
                    className="h-12"
                  />
                  {form.formState.errors.recipientName && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.recipientName.message}</p>
                  )}
                  <p className="form-helper">
                    <Info className="inline h-3 w-3 mr-1" />
                    Enter the full name exactly as it appears on their ID
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="form-field">
                  <Label htmlFor="recipientContact" className="form-label">
                    {t('momo.number')} <span className="required-indicator">*</span>
                  </Label>
                  <Input 
                    id="recipientContact" 
                    placeholder={t('momo.enter_number')} 
                    {...form.register('recipientContact')} 
                    className="h-12"
                  />
                  {form.formState.errors.recipientContact && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.recipientContact.message}</p>
                  )}
                  <p className="form-helper">
                    <Info className="inline h-3 w-3 mr-1" />
                    Format: +237 6XX XX XX XX for Cameroon
                  </p>
                </motion.div>

                <NameMatchConfirmation 
                  isChecked={isDetailsConfirmed}
                  onCheckedChange={handleConfirmationChange}
                  showError={showConfirmationError}
                />

                <motion.div variants={itemVariants} className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full h-12 text-base rounded-xl shadow-md shadow-primary-500/20 bg-green-600 hover:bg-green-700"
                  >
                    {t('sendMoney.submitButton')}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </SendMoneyLayout>
  );
};

export default SendMoneyContainer;
