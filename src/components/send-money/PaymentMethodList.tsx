
import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Building, CreditCard } from 'lucide-react';
import PaymentMethodCard from '@/components/payment-method/PaymentMethodCard';
import { useToast } from '@/components/ui/use-toast';
import { Country } from '@/hooks/useCountries';

interface PaymentMethodListProps {
  selectedCountry: string;
  selectedCountryData: Country | undefined;
  selectedPaymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
  providerOptions: {
    [key: string]: {
      [key: string]: Array<{ id: string; name: string }>;
      default: Array<{ id: string; name: string }>;
    };
  };
}

const PaymentMethodList: React.FC<PaymentMethodListProps> = ({
  selectedCountry,
  selectedCountryData,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  providerOptions,
}) => {
  const { toast } = useToast();
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Get provider options for the selected payment method and country
  const getProviderOptions = (methodId: string, countryCode: string) => {
    const methodProviders = providerOptions[methodId as keyof typeof providerOptions];
    if (!methodProviders) return [];
    
    return methodProviders[countryCode as keyof typeof methodProviders] || methodProviders.default || [];
  };

  // Get the icon component based on the icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'smartphone':
        return <Smartphone className="h-5 w-5 text-primary-500" />;
      case 'bank':
        return <Building className="h-5 w-5 text-primary-500" />;
      case 'credit-card':
        return <CreditCard className="h-5 w-5 text-primary-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-primary-500" />;
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    onSelectPaymentMethod(method);
    
    // Find the payment method name to display in the toast
    const paymentMethod = selectedCountryData?.paymentMethods.find(pm => pm.id === method);
    
    toast({
      title: "Payment method selected",
      description: `You've selected ${paymentMethod?.name || method}`,
      duration: 2000,
    });
  };

  return (
    <motion.div variants={itemVariants} className="mb-4">
      <h3 className="text-sm font-medium mb-3">Select Payment Method</h3>
      <div className="space-y-3">
        {selectedCountryData?.paymentMethods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            name={method.name}
            description={method.description}
            icon={getIconComponent(method.icon)}
            isSelected={selectedPaymentMethod === method.id}
            onClick={() => handlePaymentMethodSelect(method.id)}
            options={getProviderOptions(method.id, selectedCountry)}
            countryCode={selectedCountry}
          />
        ))}
        
        {(!selectedCountryData || selectedCountryData.paymentMethods.length === 0) && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              No payment methods available for this country. Please select a different country.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentMethodList;
