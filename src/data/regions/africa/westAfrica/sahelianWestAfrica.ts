
import { Country } from '../../../../types/country';

export const sahelianWestAfricanCountries: Country[] = [
  {
    name: 'Senegal',
    code: 'SN',
    flagUrl: 'https://flagcdn.com/sn.svg',
    currency: 'XOF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Orange Money and Wave mobile wallets',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct transfer to Senegalese banks',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '1-2 business days',
      },
    ],
  },
  {
    name: 'Mali',
    code: 'ML',
    flagUrl: 'https://flagcdn.com/ml.svg',
    currency: 'XOF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Orange Money mobile wallets',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Niger',
    code: 'NE',
    flagUrl: 'https://flagcdn.com/ne.svg',
    currency: 'XOF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Orange Money and other mobile wallets',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Burkina Faso',
    code: 'BF',
    flagUrl: 'https://flagcdn.com/bf.svg',
    currency: 'XOF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Orange Money and other mobile wallets',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
    ],
  },
];
