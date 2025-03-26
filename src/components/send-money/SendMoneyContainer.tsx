
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
import ExchangeRateCalculator from '@/components/ExchangeRateCalculator';
import { kadoRedirectService } from '@/services/kado/redirect';

const formSchema = z.object({
  amount: z.string().min(1, {
    message: "Amount is required.",
  }),
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
  const [showCalculator, setShowCalculator] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
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
  }, [defaultCountryCode, form.setValue]);

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
      // Generate a unique transaction ID
      const newTransactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setTransactionId(newTransactionId);

      // Store the transaction details in localStorage
      localStorage.setItem('pendingTransaction', JSON.stringify({
        ...values,
        transactionId: newTransactionId
      }));

      // Redirect to Kado
      await kadoRedirectService.redirectToKado({
        amount: values.amount,
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

  // Handler for continuing after selecting amount and currencies
  const handleCalculatorContinue = () => {
    setShowCalculator(false);
  };

  if (needsInitialData) {
    return (
      <div className="container mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle>{t('sendMoney.initialDataTitle')}</CardTitle>
            <CardDescription>{t('sendMoney.initialDataDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ExchangeRateCalculator onContinue={onInitialDataContinue} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCalculator) {
    return (
      <div className="container mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle>{t('sendMoney.calculatorTitle')}</CardTitle>
            <CardDescription>{t('sendMoney.calculatorDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ExchangeRateCalculator inlineMode onContinue={handleCalculatorContinue} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>{t('sendMoney.title')}</CardTitle>
          <CardDescription>{t('sendMoney.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && <div className="text-red-500">{error.toString()}</div>}

            <div>
              <Label htmlFor="amount">{t('sendMoney.amountLabel')}</Label>
              <Input id="amount" type="number" placeholder={t('sendMoney.amountPlaceholder')} {...form.register('amount')} />
              {form.formState.errors.amount && (
                <p className="text-red-500 text-sm">{form.formState.errors.amount.message}</p>
              )}
            </div>

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
              <Label>{t('sendMoney.paymentMethodLabel')}</Label>
              {paymentMethodsLoading ? (
                <p>Loading payment methods...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      name={method.name}
                      description={method.id === 'mobile_money' ? 'Send via mobile money' : 'Send via bank transfer'}
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
              <Label htmlFor="recipientName">{t('sendMoney.recipientNameLabel')}</Label>
              <Input id="recipientName" placeholder={t('sendMoney.recipientNamePlaceholder')} {...form.register('recipientName')} />
              {form.formState.errors.recipientName && (
                <p className="text-red-500 text-sm">{form.formState.errors.recipientName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="recipientContact">{t('sendMoney.recipientContactLabel')}</Label>
              <Input id="recipientContact" placeholder={t('sendMoney.recipientContactPlaceholder')} {...form.register('recipientContact')} />
              {form.formState.errors.recipientContact && (
                <p className="text-red-500 text-sm">{form.formState.errors.recipientContact.message}</p>
              )}
            </div>

            <Button disabled={isLoading}>{t('sendMoney.submitButton')}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendMoneyContainer;
