
import { useState, useEffect } from 'react';

interface PaymentMethodProvider {
  id: string;
  name: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  providers?: string[];
}

/**
 * Hook to get available payment methods for a specific country
 */
export const usePaymentMethods = (countryCode: string) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!countryCode) {
        setPaymentMethods([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call
        // For now, we use country-specific mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (countryCode === 'CM') {
          // Cameroon payment methods
          setPaymentMethods([
            {
              id: 'mobile_money',
              name: 'Mobile Money',
              description: 'Pay using your mobile money account',
              providers: ['MTN Mobile Money', 'Orange Money']
            },
            {
              id: 'bank_transfer',
              name: 'Bank Transfer',
              description: 'Transfer directly from your bank account',
              providers: ['Afriland First Bank', 'Ecobank', 'UBA']
            }
          ]);
        } else if (countryCode === 'NG') {
          // Nigeria payment methods
          setPaymentMethods([
            {
              id: 'mobile_money',
              name: 'Mobile Money',
              description: 'Pay using your mobile money account',
              providers: ['Paga', 'OPay', 'PalmPay']
            },
            {
              id: 'bank_transfer',
              name: 'Bank Transfer',
              description: 'Transfer directly from your bank account',
              providers: ['GTBank', 'Access Bank', 'First Bank']
            }
          ]);
        } else if (countryCode === 'GH') {
          // Ghana payment methods
          setPaymentMethods([
            {
              id: 'mobile_money',
              name: 'Mobile Money',
              description: 'Pay using your mobile money account',
              providers: ['MTN Mobile Money', 'Vodafone Cash', 'AirtelTigo Money']
            },
            {
              id: 'bank_transfer',
              name: 'Bank Transfer',
              description: 'Transfer directly from your bank account',
              providers: ['GCB Bank', 'Ecobank Ghana', 'Stanbic Bank']
            }
          ]);
        } else {
          // Default payment methods for other countries
          setPaymentMethods([
            {
              id: 'mobile_money',
              name: 'Mobile Money',
              description: 'Pay using your mobile money account',
              providers: ['Mobile Money']
            },
            {
              id: 'bank_transfer',
              name: 'Bank Transfer',
              description: 'Transfer directly from your bank account',
              providers: ['Bank Transfer']
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching payment methods:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch payment methods'));
        setPaymentMethods([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [countryCode]);

  return {
    paymentMethods,
    isLoading,
    error
  };
};
