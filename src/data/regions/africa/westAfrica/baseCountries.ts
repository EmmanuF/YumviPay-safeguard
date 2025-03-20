
import { Country } from '../../../../../types/country';

// Define base data for West African countries
export const getWestAfricaBaseCountries = (): Country[] => {
  return [
    {
      name: 'Nigeria',
      code: 'NG',
      flagUrl: 'https://flagcdn.com/ng.svg',
      currency: 'NGN',
      isSendingEnabled: false,
      isReceivingEnabled: true,
      phonePrefix: '+234',
      paymentMethods: [
        {
          id: 'bank_transfer',
          name: 'Bank Transfer',
          description: 'Send directly to a Nigerian bank account',
          icon: 'bank',
          fees: '1.2%',
          processingTime: '1-2 business days',
        },
        {
          id: 'mobile_money',
          name: 'Mobile Money',
          description: 'Send to a Nigerian mobile money account',
          icon: 'smartphone',
          fees: '1.0%',
          processingTime: 'Instant',
        },
      ],
    },
    {
      name: 'Ghana',
      code: 'GH',
      flagUrl: 'https://flagcdn.com/gh.svg',
      currency: 'GHS',
      isSendingEnabled: false,
      isReceivingEnabled: true,
      phonePrefix: '+233',
      paymentMethods: [
        {
          id: 'bank_transfer',
          name: 'Bank Transfer',
          description: 'Send directly to a Ghanaian bank account',
          icon: 'bank',
          fees: '1.2%',
          processingTime: '1-2 business days',
        },
        {
          id: 'mobile_money',
          name: 'Mobile Money',
          description: 'Send to MTN Mobile Money, Vodafone Cash or AirtelTigo Money',
          icon: 'smartphone',
          fees: '1.0%',
          processingTime: 'Instant',
        },
      ],
    },
    {
      name: 'Senegal',
      code: 'SN',
      flagUrl: 'https://flagcdn.com/sn.svg',
      currency: 'XOF',
      isSendingEnabled: false,
      isReceivingEnabled: true,
      phonePrefix: '+221',
      paymentMethods: [
        {
          id: 'bank_transfer',
          name: 'Bank Transfer',
          description: 'Send directly to a Senegalese bank account',
          icon: 'bank',
          fees: '1.3%',
          processingTime: '1-2 business days',
        },
        {
          id: 'mobile_money',
          name: 'Mobile Money',
          description: 'Send to Orange Money or Wave',
          icon: 'smartphone',
          fees: '1.1%',
          processingTime: 'Instant',
        },
      ],
    },
    {
      name: 'Côte d\'Ivoire',
      code: 'CI',
      flagUrl: 'https://flagcdn.com/ci.svg',
      currency: 'XOF',
      isSendingEnabled: false,
      isReceivingEnabled: true,
      phonePrefix: '+225',
      paymentMethods: [
        {
          id: 'bank_transfer',
          name: 'Bank Transfer',
          description: 'Send directly to an Ivorian bank account',
          icon: 'bank',
          fees: '1.3%',
          processingTime: '1-2 business days',
        },
        {
          id: 'mobile_money',
          name: 'Mobile Money',
          description: 'Send to Orange Money, MTN Mobile Money or Wave',
          icon: 'smartphone',
          fees: '1.1%',
          processingTime: 'Instant',
        },
      ],
    }
  ];
};
