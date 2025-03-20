
import { Country } from '../../../../types/country';

// Log the Cameroon country definition for debugging
console.log('Defining Cameroon country with sending enabled:', false);

export const cameroonCountry: Country = {
  name: 'Cameroon',
  code: 'CM',
  flagUrl: 'https://flagcdn.com/cm.svg',
  currency: 'XAF',
  isSendingEnabled: false,
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
