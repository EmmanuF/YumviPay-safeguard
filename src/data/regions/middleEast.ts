
import { Country } from '../../types/country';

export const middleEastCountries: Country[] = [
  {
    name: 'United Arab Emirates',
    code: 'AE',
    flagUrl: 'https://flagcdn.com/ae.svg',
    currency: 'AED',
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
        description: 'Direct transfer from your UAE bank account',
        icon: 'bank',
        fees: '0.5%',
        processingTime: '1-2 business days',
      },
    ],
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    flagUrl: 'https://flagcdn.com/sa.svg',
    currency: 'SAR',
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
        description: 'Direct transfer from your Saudi bank account',
        icon: 'bank',
        fees: '0.5%',
        processingTime: '1-2 business days',
      },
    ],
  },
  {
    name: 'Qatar',
    code: 'QA',
    flagUrl: 'https://flagcdn.com/qa.svg',
    currency: 'QAR',
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
        description: 'Direct transfer from your Qatari bank account',
        icon: 'bank',
        fees: '0.5%',
        processingTime: '1-2 business days',
      },
    ],
  },
  // Add more Middle Eastern countries as needed
];
