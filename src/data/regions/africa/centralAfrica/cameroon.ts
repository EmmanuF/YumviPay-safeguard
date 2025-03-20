
import { Country } from '../../../../types/country';

// Cameroon - Our MVP focus country
export const cameroonCountry: Country = {
  name: 'Cameroon',
  code: 'CM',
  flagUrl: 'https://flagcdn.com/w80/cm.png',
  currency: 'XAF',
  isSendingEnabled: false, // Updated to false - Cameroon is receiving only
  isReceivingEnabled: true,
  phonePrefix: '+237',
  paymentMethods: [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      description: 'Send to MTN MoMo or Orange Money',
      icon: 'smartphone',
      fees: '1-2%',
      processingTime: 'Instant',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Send to any Cameroonian bank',
      icon: 'bank',
      fees: '1.5-2.5%',
      processingTime: '1-2 business days',
    },
    {
      id: 'cash_pickup',
      name: 'Cash Pickup',
      description: 'Recipient collects cash at a local agent',
      icon: 'banknote',
      fees: '2-3%',
      processingTime: 'Same day',
    },
  ],
};
