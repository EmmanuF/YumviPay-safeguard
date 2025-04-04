import { Country } from '../../../types/country';

export const southernAfricanCountries: Country[] = [
  {
    name: 'South Africa',
    code: 'ZA',
    flagUrl: 'https://flagcdn.com/za.svg',
    currency: 'ZAR',
    isSendingEnabled: true,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct transfer to South African banks',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '1-2 business days',
      },
    ],
    phonePrefix: '+27'
  },
  {
    name: 'Angola',
    code: 'AO',
    flagUrl: 'https://flagcdn.com/ao.svg',
    currency: 'AOA',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Receive to Angolan bank accounts',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '2-3 business days',
      },
    ],
  },
  {
    name: 'Namibia',
    code: 'NA',
    flagUrl: 'https://flagcdn.com/na.svg',
    currency: 'NAD',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Receive to Namibian bank accounts',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '1-2 business days',
      },
    ],
  },
  {
    name: 'Botswana',
    code: 'BW',
    flagUrl: 'https://flagcdn.com/bw.svg',
    currency: 'BWP',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Receive to Botswanan bank accounts',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '1-2 business days',
      },
    ],
  },
  {
    name: 'Zimbabwe',
    code: 'ZW',
    flagUrl: 'https://flagcdn.com/zw.svg',
    currency: 'ZWL',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'EcoCash',
        description: 'Receive to EcoCash mobile wallets',
        icon: 'smartphone',
        fees: '1.3%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Mozambique',
    code: 'MZ',
    flagUrl: 'https://flagcdn.com/mz.svg',
    currency: 'MZN',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'M-Pesa',
        description: 'Receive to M-Pesa mobile wallets',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Madagascar',
    code: 'MG',
    flagUrl: 'https://flagcdn.com/mg.svg',
    currency: 'MGA',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Receive to Orange Money and other wallets',
        icon: 'smartphone',
        fees: '1.3%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Zambia',
    code: 'ZM',
    flagUrl: 'https://flagcdn.com/zm.svg',
    currency: 'ZMW',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Receive to MTN Money and other wallets',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Malawi',
    code: 'MW',
    flagUrl: 'https://flagcdn.com/mw.svg',
    currency: 'MWK',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Airtel Money',
        description: 'Receive to Airtel Money wallets',
        icon: 'smartphone',
        fees: '1.3%',
        processingTime: 'Instant',
      },
    ],
  },
];
