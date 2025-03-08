
import { Country } from '../../types/country';

export const asiaPacificCountries: Country[] = [
  {
    name: 'Australia',
    code: 'AU',
    flagUrl: 'https://flagcdn.com/au.svg',
    currency: 'AUD',
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
        name: 'BPAY',
        description: 'Pay directly from your Australian bank account',
        icon: 'bank',
        fees: '0.8%',
        processingTime: '1-2 business days',
      },
    ],
  },
  {
    name: 'Japan',
    code: 'JP',
    flagUrl: 'https://flagcdn.com/jp.svg',
    currency: 'JPY',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with JCB, Visa or Mastercard',
        icon: 'credit-card',
        fees: '2.5%',
        processingTime: 'Instant',
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Pay via Japanese bank transfer',
        icon: 'bank',
        fees: '1%',
        processingTime: '1-2 business days',
      },
    ],
  },
];
