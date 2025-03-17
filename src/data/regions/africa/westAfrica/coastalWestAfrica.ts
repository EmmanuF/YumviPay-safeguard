
import { Country } from '../../../../types/country';

export const coastalWestAfricanCountries: Country[] = [
  {
    name: 'Nigeria',
    code: 'NG',
    flagUrl: 'https://flagcdn.com/ng.svg',
    currency: 'NGN',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct transfer to Nigerian banks',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '1-2 business days',
      },
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Send to mobile wallets like MTN MoMo',
        icon: 'smartphone',
        fees: '1%',
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
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Send to MTN, Vodafone, or AirtelTigo',
        icon: 'smartphone',
        fees: '1%',
        processingTime: 'Instant',
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct transfer to Ghanaian banks',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '1-2 business days',
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
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Orange Money and MTN MoMo mobile wallets',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct transfer to Ivorian banks',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '1-2 business days',
      },
    ],
  },
  {
    name: 'Togo',
    code: 'TG',
    flagUrl: 'https://flagcdn.com/tg.svg',
    currency: 'XOF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Receive to T-Money and other mobile wallets',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Benin',
    code: 'BJ',
    flagUrl: 'https://flagcdn.com/bj.svg',
    currency: 'XOF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'MTN MoMo and Moov Money wallets',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
    ],
  },
];
