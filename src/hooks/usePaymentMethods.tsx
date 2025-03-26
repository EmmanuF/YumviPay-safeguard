
import { useState, useEffect } from 'react';
import { useCountries } from './useCountries';
import { useKado } from '@/services/kado/useKado';

interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  providers?: string[];
  icon?: string;
  fees?: string;
  processingTime?: string;
}

export const usePaymentMethods = (countryCode: string) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getCountryByCode } = useCountries();
  const { getCountryPaymentMethods } = useKado();

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!countryCode) {
        setPaymentMethods([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // First try to get methods from Kado
        const kadoMethods = await getCountryPaymentMethods(countryCode);
        
        if (kadoMethods && kadoMethods.length > 0) {
          setPaymentMethods(kadoMethods);
        } else {
          // Fallback to country data if Kado returns empty
          const country = getCountryByCode(countryCode);
          if (country && country.paymentMethods) {
            setPaymentMethods(country.paymentMethods);
          } else {
            // Default fallback for Cameroon
            if (countryCode === 'CM') {
              setPaymentMethods([
                {
                  id: 'mobile_money',
                  name: 'Mobile Money',
                  description: 'Send via mobile money providers',
                  icon: 'smartphone',
                  providers: ['MTN Mobile Money', 'Orange Money']
                },
                {
                  id: 'bank_transfer',
                  name: 'Bank Transfer',
                  description: 'Send via bank transfer',
                  icon: 'building',
                  providers: ['Afriland First Bank', 'Ecobank']
                }
              ]);
            } else {
              setPaymentMethods([]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        setPaymentMethods([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [countryCode, getCountryByCode, getCountryPaymentMethods]);

  return { paymentMethods, isLoading };
};
