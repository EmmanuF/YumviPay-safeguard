
import { Country } from '../../../types/country';

export const centralAfricanCountries: Country[] = [
  {
    name: 'Cameroon',
    code: 'CM',
    flagUrl: 'https://flagcdn.com/cm.svg',
    currency: 'XAF',
    isSendingEnabled: true, // Changed back to true to enable as MVP country
    isReceivingEnabled: true,
    phonePrefix: '+237',
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'MTN MoMo and Orange Money wallets',
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
      },
    ],
  },
  {
    name: 'Congo DRC',
    code: 'CD',
    flagUrl: 'https://flagcdn.com/cd.svg',
    currency: 'CDF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    phonePrefix: '+243',
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'M-Pesa and Airtel Money wallets',
        icon: 'smartphone',
        fees: '1.3%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Gabon',
    code: 'GA',
    flagUrl: 'https://flagcdn.com/ga.svg',
    currency: 'XAF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Airtel Money and Mobile Money wallets',
        icon: 'smartphone',
        fees: '1.2%',
        processingTime: 'Instant',
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct transfer to Gabonese banks',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '1-2 business days',
      },
    ],
  },
  {
    name: 'Chad',
    code: 'TD',
    flagUrl: 'https://flagcdn.com/td.svg',
    currency: 'XAF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Receive to mobile wallets',
        icon: 'smartphone',
        fees: '1.3%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Central African Republic',
    code: 'CF',
    flagUrl: 'https://flagcdn.com/cf.svg',
    currency: 'XAF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Receive to mobile wallets',
        icon: 'smartphone',
        fees: '1.3%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Equatorial Guinea',
    code: 'GQ',
    flagUrl: 'https://flagcdn.com/gq.svg',
    currency: 'XAF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Receive to bank accounts',
        icon: 'bank',
        fees: '1.5%',
        processingTime: '2-3 business days',
      },
    ],
  },
  {
    name: 'Republic of the Congo',
    code: 'CG',
    flagUrl: 'https://flagcdn.com/cg.svg',
    currency: 'XAF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Receive to Airtel Money and other wallets',
        icon: 'smartphone',
        fees: '1.3%',
        processingTime: 'Instant',
      },
    ],
  },
];
