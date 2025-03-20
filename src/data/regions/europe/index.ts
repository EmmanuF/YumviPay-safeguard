
import { Country } from '../../../types/country';

// European countries - all should be sending countries
export const europeanCountries: Country[] = [
  {
    name: 'United Kingdom',
    code: 'GB',
    flagUrl: 'https://flagcdn.com/gb.svg',
    currency: 'GBP',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    phonePrefix: '+44',
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Send directly from your bank account',
        icon: 'bank',
        fees: '1.0%',
        processingTime: '1-2 business days',
      },
      {
        id: 'debit_card',
        name: 'Debit Card',
        description: 'Pay with Visa, Mastercard or other cards',
        icon: 'credit-card',
        fees: '1.5%',
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
    phonePrefix: '+33',
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Send directly from your bank account',
        icon: 'bank',
        fees: '1.0%',
        processingTime: '1-2 business days',
      },
      {
        id: 'debit_card',
        name: 'Debit Card',
        description: 'Pay with Visa, Mastercard or other cards',
        icon: 'credit-card',
        fees: '1.5%',
        processingTime: 'Instant',
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
    phonePrefix: '+49',
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Send directly from your bank account',
        icon: 'bank',
        fees: '1.0%',
        processingTime: '1-2 business days',
      },
      {
        id: 'debit_card',
        name: 'Debit Card',
        description: 'Pay with Visa, Mastercard or other cards',
        icon: 'credit-card',
        fees: '1.5%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Italy',
    code: 'IT',
    flagUrl: 'https://flagcdn.com/it.svg',
    currency: 'EUR',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    phonePrefix: '+39',
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Send directly from your bank account',
        icon: 'bank',
        fees: '1.0%',
        processingTime: '1-2 business days',
      },
      {
        id: 'debit_card',
        name: 'Debit Card',
        description: 'Pay with Visa, Mastercard or other cards',
        icon: 'credit-card',
        fees: '1.5%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Spain',
    code: 'ES',
    flagUrl: 'https://flagcdn.com/es.svg',
    currency: 'EUR',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    phonePrefix: '+34',
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Send directly from your bank account',
        icon: 'bank',
        fees: '1.0%',
        processingTime: '1-2 business days',
      },
      {
        id: 'debit_card',
        name: 'Debit Card',
        description: 'Pay with Visa, Mastercard or other cards',
        icon: 'credit-card',
        fees: '1.5%',
        processingTime: 'Instant',
      },
    ],
  }
];

// Add debug logging
console.log('🔍 EUROPE: Final countries data - All should have isSendingEnabled=true');
europeanCountries.forEach(c => {
  console.log(`🔍 EUROPE FINAL: ${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});
