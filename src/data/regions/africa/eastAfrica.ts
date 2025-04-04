import { Country } from '../../../types/country';

export const eastAfricanCountries: Country[] = [
  {
    name: 'Kenya',
    code: 'KE',
    flagUrl: 'https://flagcdn.com/ke.svg',
    currency: 'KES',
    isSendingEnabled: true,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mpesa',
        name: 'M-Pesa',
        description: 'Send directly to M-Pesa mobile wallet',
        icon: 'smartphone',
        fees: '1%',
        processingTime: 'Instant',
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct transfer to Kenyan banks',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '1-2 business days',
      },
    ],
    phonePrefix: '+254'
  },
  {
    name: 'Uganda',
    code: 'UG',
    flagUrl: 'https://flagcdn.com/ug.svg',
    currency: 'UGX',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Receive to MTN or Airtel mobile wallets',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Receive to Ugandan bank accounts',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '1-2 business days',
      },
    ],
  },
  {
    name: 'Tanzania',
    code: 'TZ',
    flagUrl: 'https://flagcdn.com/tz.svg',
    currency: 'TZS',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Receive to Vodacom M-Pesa or Tigo Pesa',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Rwanda',
    code: 'RW',
    flagUrl: 'https://flagcdn.com/rw.svg',
    currency: 'RWF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Receive to MTN or Airtel mobile wallets',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    flagUrl: 'https://flagcdn.com/et.svg',
    currency: 'ETB',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Receive to Ethiopian bank accounts',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '2-3 business days',
      },
    ],
  },
  {
    name: 'Djibouti',
    code: 'DJ',
    flagUrl: 'https://flagcdn.com/dj.svg',
    currency: 'DJF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Receive to Djiboutian bank accounts',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '2-3 business days',
      },
    ],
  },
  {
    name: 'Somalia',
    code: 'SO',
    flagUrl: 'https://flagcdn.com/so.svg',
    currency: 'SOS',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'EVC Plus',
        description: 'Receive to Hormuud EVC Plus wallets',
        icon: 'smartphone',
        fees: '1.5%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Eritrea',
    code: 'ER',
    flagUrl: 'https://flagcdn.com/er.svg',
    currency: 'ERN',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Receive to Eritrean bank accounts',
        icon: 'bank',
        fees: '1.8%',
        processingTime: '2-3 business days',
      },
    ],
  },
];
