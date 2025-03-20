
import { Country } from '../../types/country';

export const northAmericanCountries: Country[] = [
  {
    name: 'United States',
    code: 'US',
    flagUrl: 'https://flagcdn.com/us.svg',
    currency: 'USD',
    isSendingEnabled: true, // Ensure this is true for sending
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
    name: 'Canada',
    code: 'CA',
    flagUrl: 'https://flagcdn.com/ca.svg',
    currency: 'CAD',
    isSendingEnabled: true, // Ensure this is true for sending
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
        id: 'interac',
        name: 'Interac e-Transfer',
        description: 'Send directly from your Canadian bank account',
        icon: 'bank',
        fees: '1%',
        processingTime: '1-2 business days',
      },
    ],
  },
  {
    name: 'Mexico',
    code: 'MX',
    flagUrl: 'https://flagcdn.com/mx.svg',
    currency: 'MXN',
    isSendingEnabled: true, // Ensure this is true for sending
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
        name: 'SPEI Transfer',
        description: 'Direct transfer from your Mexican bank account',
        icon: 'bank',
        fees: '1%',
        processingTime: '1-2 business days',
      },
    ],
  },
  {
    name: 'Panama',
    code: 'PA',
    flagUrl: 'https://flagcdn.com/pa.svg',
    currency: 'PAB',
    isSendingEnabled: true, // Ensure this is true for sending
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
    ],
  },
];
