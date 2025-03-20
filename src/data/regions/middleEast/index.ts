
import { Country } from '../../../types/country';

// Middle East countries - mostly sending countries
export const middleEastCountries: Country[] = [
  {
    name: 'United Arab Emirates',
    code: 'AE',
    flagUrl: 'https://flagcdn.com/ae.svg',
    currency: 'AED',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    phonePrefix: '+971',
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
    name: 'Saudi Arabia',
    code: 'SA',
    flagUrl: 'https://flagcdn.com/sa.svg',
    currency: 'SAR',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    phonePrefix: '+966',
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
    name: 'Qatar',
    code: 'QA',
    flagUrl: 'https://flagcdn.com/qa.svg',
    currency: 'QAR',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    phonePrefix: '+974',
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
    name: 'Kuwait',
    code: 'KW',
    flagUrl: 'https://flagcdn.com/kw.svg',
    currency: 'KWD',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    phonePrefix: '+965',
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
console.log('🔍 MIDDLE EAST: Final countries data');
middleEastCountries.forEach(c => {
  console.log(`🔍 MIDDLE EAST FINAL: ${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});
