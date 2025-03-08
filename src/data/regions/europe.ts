
import { Country } from '../../types/country';

export const europeanCountries: Country[] = [
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
  {
    name: 'Germany',
    code: 'DE',
    flagUrl: 'https://flagcdn.com/de.svg',
    currency: 'EUR',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'sepa',
        name: 'SEPA Transfer',
        description: 'Send via the Single Euro Payments Area',
        icon: 'bank',
        fees: '0.5%',
        processingTime: '1-2 business days',
      },
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa, Mastercard, or American Express',
        icon: 'credit-card',
        fees: '2.5%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'France',
    code: 'FR',
    flagUrl: 'https://flagcdn.com/fr.svg',
    currency: 'EUR',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'sepa',
        name: 'SEPA Transfer',
        description: 'Send via the Single Euro Payments Area',
        icon: 'bank',
        fees: '0.5%',
        processingTime: '1-2 business days',
      },
    ],
  },
];
