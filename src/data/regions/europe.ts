
import { Country } from '../../types/country';

export const europeanCountries: Country[] = [
  {
    name: 'United Kingdom',
    code: 'GB',
    flagUrl: 'https://flagcdn.com/gb.svg',
    currency: 'GBP',
    isSendingEnabled: true, // Ensure this is true
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
    name: 'France',
    code: 'FR',
    flagUrl: 'https://flagcdn.com/fr.svg',
    currency: 'EUR',
    isSendingEnabled: true, // Ensure this is true
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
        id: 'sepa',
        name: 'SEPA Transfer',
        description: 'European bank transfer',
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
    isSendingEnabled: true, // Ensure this is true
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
        id: 'sepa',
        name: 'SEPA Transfer',
        description: 'European bank transfer',
        icon: 'bank',
        fees: '0.5%',
        processingTime: '1-2 business days',
      },
    ],
  },
  {
    name: 'Switzerland',
    code: 'CH',
    flagUrl: 'https://flagcdn.com/ch.svg',
    currency: 'CHF',
    isSendingEnabled: true, // Ensure this is true
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
        description: 'Direct transfer from your Swiss bank account',
        icon: 'bank',
        fees: '0.5%',
        processingTime: '1-2 business days',
      },
    ],
  },
  // Add more European countries here as needed
];
