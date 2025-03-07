
import { useState, useEffect } from 'react';

export interface Country {
  name: string;
  code: string;
  flagUrl: string;
  currency: string;
  isSendingEnabled: boolean;
  isReceivingEnabled: boolean;
  paymentMethods: PaymentMethod[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  fees: string;
  processingTime: string;
}

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockCountries: Country[] = [
          {
            name: 'Nigeria',
            code: 'NG',
            flagUrl: 'https://flagcdn.com/ng.svg',
            currency: 'NGN',
            isSendingEnabled: true,
            isReceivingEnabled: true,
            paymentMethods: [
              {
                id: 'bank_transfer',
                name: 'Bank Transfer',
                description: 'Direct transfer to Nigerian banks',
                icon: 'bank',
                fees: '1.5%',
                processingTime: '1-2 business days',
              },
              {
                id: 'mobile_money',
                name: 'Mobile Money',
                description: 'Send to mobile wallets like MTN MoMo',
                icon: 'smartphone',
                fees: '1%',
                processingTime: 'Instant',
              },
            ],
          },
          {
            name: 'Kenya',
            code: 'KE',
            flagUrl: 'https://flagcdn.com/ke.svg',
            currency: 'KES',
            isSendingEnabled: true,
            isReceivingEnabled: true,
            paymentMethods: [
              {
                id: 'mpesa',
                name: 'M-Pesa',
                description: 'Send directly to M-Pesa mobile wallet',
                icon: 'smartphone',
                fees: '1%',
                processingTime: 'Instant',
              },
              {
                id: 'bank_transfer',
                name: 'Bank Transfer',
                description: 'Direct transfer to Kenyan banks',
                icon: 'bank',
                fees: '1.5%',
                processingTime: '1-2 business days',
              },
            ],
          },
          {
            name: 'Ghana',
            code: 'GH',
            flagUrl: 'https://flagcdn.com/gh.svg',
            currency: 'GHS',
            isSendingEnabled: true,
            isReceivingEnabled: true,
            paymentMethods: [
              {
                id: 'mobile_money',
                name: 'Mobile Money',
                description: 'Send to MTN, Vodafone, or AirtelTigo',
                icon: 'smartphone',
                fees: '1%',
                processingTime: 'Instant',
              },
              {
                id: 'bank_transfer',
                name: 'Bank Transfer',
                description: 'Direct transfer to Ghanaian banks',
                icon: 'bank',
                fees: '1.5%',
                processingTime: '1-2 business days',
              },
            ],
          },
          {
            name: 'South Africa',
            code: 'ZA',
            flagUrl: 'https://flagcdn.com/za.svg',
            currency: 'ZAR',
            isSendingEnabled: true,
            isReceivingEnabled: true,
            paymentMethods: [
              {
                id: 'bank_transfer',
                name: 'Bank Transfer',
                description: 'Direct transfer to South African banks',
                icon: 'bank',
                fees: '1.5%',
                processingTime: '1-2 business days',
              },
            ],
          },
          {
            name: 'United States',
            code: 'US',
            flagUrl: 'https://flagcdn.com/us.svg',
            currency: 'USD',
            isSendingEnabled: true,
            isReceivingEnabled: false,
            paymentMethods: [
              {
                id: 'credit_card',
                name: 'Credit Card',
                description: 'Pay with Visa, Mastercard, or Amex',
                icon: 'credit-card',
                fees: '2.5%',
                processingTime: 'Instant',
              },
              {
                id: 'bank_transfer',
                name: 'ACH Transfer',
                description: 'Direct transfer from your US bank account',
                icon: 'bank',
                fees: '0.5%',
                processingTime: '3-5 business days',
              },
            ],
          },
          {
            name: 'United Kingdom',
            code: 'GB',
            flagUrl: 'https://flagcdn.com/gb.svg',
            currency: 'GBP',
            isSendingEnabled: true,
            isReceivingEnabled: false,
            paymentMethods: [
              {
                id: 'credit_card',
                name: 'Credit Card',
                description: 'Pay with Visa, Mastercard, or Amex',
                icon: 'credit-card',
                fees: '2.5%',
                processingTime: 'Instant',
              },
              {
                id: 'bank_transfer',
                name: 'Bank Transfer',
                description: 'Direct transfer from your UK bank account',
                icon: 'bank',
                fees: '0.5%',
                processingTime: '1-2 business days',
              },
            ],
          },
        ];

        setCountries(mockCountries);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const getCountryByCode = (code: string) => {
    return countries.find(country => country.code === code);
  };

  const getSendingCountries = () => {
    return countries.filter(country => country.isSendingEnabled);
  };

  const getReceivingCountries = () => {
    return countries.filter(country => country.isReceivingEnabled);
  };

  return {
    countries,
    isLoading,
    error,
    getCountryByCode,
    getSendingCountries,
    getReceivingCountries,
  };
}
