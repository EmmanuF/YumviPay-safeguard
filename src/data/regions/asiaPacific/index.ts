
import { Country } from '../../../types/country';

// Asia Pacific countries - some sending countries
export const asiaPacificCountries: Country[] = [
  {
    name: 'Australia',
    code: 'AU',
    flagUrl: 'https://flagcdn.com/au.svg',
    currency: 'AUD',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    phonePrefix: '+61',
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
    name: 'Japan',
    code: 'JP',
    flagUrl: 'https://flagcdn.com/jp.svg',
    currency: 'JPY',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    phonePrefix: '+81',
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
    name: 'Singapore',
    code: 'SG',
    flagUrl: 'https://flagcdn.com/sg.svg',
    currency: 'SGD',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    phonePrefix: '+65',
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
console.log('🔍 ASIA PACIFIC: Final countries data');
asiaPacificCountries.forEach(c => {
  console.log(`🔍 ASIA PACIFIC FINAL: ${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});
