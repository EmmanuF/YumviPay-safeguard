
import { Country } from '../../../types/country';

// North American countries - all should be sending countries
export const northAmericanCountries: Country[] = [
  {
    name: 'United States',
    code: 'US',
    flagUrl: 'https://flagcdn.com/us.svg',
    currency: 'USD',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    phonePrefix: '+1',
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'ACH Transfer',
        description: 'Send directly from your bank account',
        icon: 'bank',
        fees: '0.8%',
        processingTime: '1-3 business days',
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
    name: 'Canada',
    code: 'CA',
    flagUrl: 'https://flagcdn.com/ca.svg',
    currency: 'CAD',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    phonePrefix: '+1',
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'EFT Transfer',
        description: 'Send directly from your bank account',
        icon: 'bank',
        fees: '0.9%',
        processingTime: '1-3 business days',
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
console.log('🔍 NORTH AMERICA: Final countries data - All should have isSendingEnabled=true');
northAmericanCountries.forEach(c => {
  console.log(`🔍 NORTH AMERICA FINAL: ${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});
