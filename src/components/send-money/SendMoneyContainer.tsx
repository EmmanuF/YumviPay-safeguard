
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
} from "@/components/ui/card"
import { cn } from '@/lib/utils';
import PaymentMethodCard from '@/components/PaymentMethodCard';
import { Building, Wallet, CreditCard, Contact2 } from 'lucide-react';
import { kadoRedirectService } from '@/services/kado/redirect';
import { getTransactionData } from '@/utils/transactionDataStore';
import { generateTransactionId } from '@/utils/transactionUtils';

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
  const [processingPayment, setProcessingPayment] = useState(false);
  
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

  const paymentMethodIcon = (method: string) => {
    switch (method) {
      case 'mobile_money':
        return <Wallet className="h-6 w-6 text-green-500" />;
      case 'bank_transfer':
        return <Building className="h-6 w-6 text-blue-500" />;
      case 'credit_card':
        return <CreditCard className="h-6 w-6 text-purple-500" />;
      default:
        return <Contact2 className="h-6 w-6 text-gray-500" />;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (processingPayment) {
        console.log('Already processing payment, preventing duplicate submission');
        return;
      }
      
      setProcessingPayment(true);
      
      // Generate a unique transaction ID with our utility
      const newTransactionId = generateTransactionId();
      console.log(`Generated transaction ID: ${newTransactionId}`);

      // Get the amount and currency information from the stored transaction data
      const amount = storedTransactionData?.amount?.toString() || "0";
      
      // Store the transaction details in localStorage with nameMatchConfirmed
      localStorage.setItem('pendingTransaction', JSON.stringify({
        ...values,
        amount,
        transactionId: newTransactionId,
        sourceCurrency: storedTransactionData?.sourceCurrency || 'USD',
        targetCurrency: storedTransactionData?.targetCurrency || 'XAF',
        convertedAmount: storedTransactionData?.convertedAmount || 0,
        exchangeRate: storedTransactionData?.exchangeRate || 610,
        nameMatchConfirmed: true // Ensuring this is set
      }));

      // Use our improved Kado redirection service
      await kadoRedirectService.redirectToKado({
        amount,
        recipientName: values.recipientName,
        recipientContact: values.recipientContact,
        country: values.country,
        paymentMethod: values.paymentMethod,
        transactionId: newTransactionId,
        returnUrl: `/transaction/${newTransactionId}`,
      });

      // If we get here, redirect failed but we'll navigate anyway
      navigate(`/transaction/${newTransactionId}`);
    } catch (error: any) {
      console.error("Kado redirect error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  // If we're still loading initial data, but don't have it yet, show minimal UI
  if (needsInitialData && !storedTransactionData) {
    return (
      <div className="container mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle>{t('sendMoney.pleaseWait')}</CardTitle>
            <CardDescription>{t('sendMoney.loadingData')}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display transaction form with pre-filled data
  return (
    <div className="container mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>{t('transaction.send_money')}</CardTitle>
          <CardDescription>{t('sendMoney.description')}</CardDescription>
          {storedTransactionData && (
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <p className="font-medium">{t('transaction.amount')}: <span className="text-primary">{storedTransactionData.amount} {storedTransactionData.sourceCurrency}</span></p>
              <p className="text-sm text-muted-foreground">{t('transaction.recipient_gets')}: {storedTransactionData.convertedAmount} {storedTransactionData.targetCurrency}</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && <div className="text-red-500">{error.toString()}</div>}

            <div>
              <Label htmlFor="country">{t('sendMoney.countryLabel')}</Label>
              <Select onValueChange={handleCountryChange} defaultValue={defaultCountryCode || ''}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('sendMoney.countryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {countriesLoading ? (
                    <SelectItem value="loading" disabled>Loading countries...</SelectItem>
                  ) : (
                    countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {form.formState.errors.country && (
                <p className="text-red-500 text-sm">{form.formState.errors.country.message}</p>
              )}
            </div>

            <div>
              <Label>{t('transaction.payment_method')}</Label>
              {paymentMethodsLoading ? (
                <p>Loading payment methods...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      name={method.name}
                      description={method.id === 'mobile_money' ? t('payment.mobile_money') : t('payment.bank_transfer')}
                      icon={paymentMethodIcon(method.id)}
                      isSelected={selectedPaymentMethod === method.id}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      options={method.providers ? method.providers.map(provider => ({
                        id: provider,
                        name: provider
                      })) : []}
                    />
                  ))}
                </div>
              )}
              {form.formState.errors.paymentMethod && (
                <p className="text-red-500 text-sm">{form.formState.errors.paymentMethod.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="recipientName">{t('transaction.recipient')}</Label>
              <Input id="recipientName" placeholder={t('sendMoney.recipientNamePlaceholder')} {...form.register('recipientName')} />
              {form.formState.errors.recipientName && (
                <p className="text-red-500 text-sm">{form.formState.errors.recipientName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="recipientContact">{t('momo.number')}</Label>
              <Input id="recipientContact" placeholder={t('momo.enter_number')} {...form.register('recipientContact')} />
              {form.formState.errors.recipientContact && (
                <p className="text-red-500 text-sm">{form.formState.errors.recipientContact.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading || processingPayment}>
              {processingPayment ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-0 border-white rounded-full"></span>
                  {t('sendMoney.processing')}
                </span>
              ) : (
                t('sendMoney.submitButton')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendMoneyContainer;
