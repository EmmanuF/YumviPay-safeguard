
import { Country } from '../../../../types/country';

// Explicitly set isSendingEnabled to false with clear logging
console.log('🔍 DEFINITION: Cameroon country with isSendingEnabled:', false);

export const cameroonCountry: Country = {
  name: 'Cameroon',
  code: 'CM',
  flagUrl: 'https://flagcdn.com/cm.svg',
  currency: 'XAF',
  isSendingEnabled: false, // Explicitly set to false
  isReceivingEnabled: true,
  phonePrefix: '+237',
  paymentMethods: [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      description: 'Pay using Orange Money, MTN Mobile Money or other mobile wallets',
      icon: 'smartphone',
      fees: '1.2%',
      processingTime: 'Instant',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct transfer to Cameroonian banks',
      icon: 'bank',
      fees: '1.5%',
      processingTime: '1-2 business days',
    }
  ],
};

// Additional debug check after export
console.log('🔍 AFTER EXPORT: Cameroon isSendingEnabled:', cameroonCountry.isSendingEnabled);
