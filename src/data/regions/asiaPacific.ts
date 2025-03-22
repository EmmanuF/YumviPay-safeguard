
import { Country } from '../../types/country';

export const asiaPacificCountries: Country[] = [
  {
    name: 'Australia',
    code: 'AU',
    flagUrl: 'https://flagcdn.com/au.svg',
    currency: 'AUD',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa, Mastercard, or Amex',
        icon: 'credit-card',
        fees: '2.5%',
        processingTime: 'Instant',
      },
      {
        id: 'bank_transfer',
        name: 'BPAY',
        description: 'Pay directly from your Australian bank account',
        icon: 'bank',
        fees: '0.8%',
        processingTime: '1-2 business days',
      },
    ],
    phonePrefix: '+61'
  },
  {
    name: 'Japan',
    code: 'JP',
    flagUrl: 'https://flagcdn.com/jp.svg',
    currency: 'JPY',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with JCB, Visa or Mastercard',
        icon: 'credit-card',
        fees: '2.5%',
        processingTime: 'Instant',
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Pay via Japanese bank transfer',
        icon: 'bank',
        fees: '1%',
        processingTime: '1-2 business days',
      },
    ],
    phonePrefix: '+81'
  },
  {
    name: 'Singapore',
    code: 'SG',
    flagUrl: 'https://flagcdn.com/sg.svg',
    currency: 'SGD',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa, Mastercard, or Amex',
        icon: 'credit-card',
        fees: '2.5%',
        processingTime: 'Instant',
      },
      {
        id: 'bank_transfer',
        name: 'FAST Transfer',
        description: 'Direct transfer from your Singaporean bank account',
        icon: 'bank',
        fees: '0.8%',
        processingTime: '1-2 business days',
      },
    ],
    phonePrefix: '+65'
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    flagUrl: 'https://flagcdn.com/nz.svg',
    currency: 'NZD',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa or Mastercard',
        icon: 'credit-card',
        fees: '2.5%',
        processingTime: 'Instant',
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct transfer from your NZ bank account',
        icon: 'bank',
        fees: '0.8%',
        processingTime: '1-2 business days',
      },
    ],
    phonePrefix: '+64'
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    flagUrl: 'https://flagcdn.com/ae.svg',
    currency: 'AED',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa or Mastercard',
        icon: 'credit-card',
        fees: '2.5%',
        processingTime: 'Instant',
      },
    ],
    phonePrefix: '+971'
  },
  {
    name: 'Qatar',
    code: 'QA',
    flagUrl: 'https://flagcdn.com/qa.svg',
    currency: 'QAR',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa or Mastercard',
        icon: 'credit-card',
        fees: '2.5%',
        processingTime: 'Instant',
      },
    ],
    phonePrefix: '+974'
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    flagUrl: 'https://flagcdn.com/sa.svg',
    currency: 'SAR',
    isSendingEnabled: true,
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa or Mastercard',
        icon: 'credit-card',
        fees: '2.5%',
        processingTime: 'Instant',
      },
    ],
    phonePrefix: '+966'
  },
  {
    name: 'South Korea',
    code: 'KR',
    flagUrl: 'https://flagcdn.com/kr.svg',
    currency: 'KRW',
    isSendingEnabled: true, // Adding South Korea as a sending country
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa or Mastercard',
        icon: 'credit-card',
        fees: '2.5%',
        processingTime: 'Instant',
      },
    ],
    phonePrefix: '+82'
  },
  {
    name: 'Malaysia',
    code: 'MY',
    flagUrl: 'https://flagcdn.com/my.svg',
    currency: 'MYR',
    isSendingEnabled: true, // Adding Malaysia as a sending country
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa or Mastercard',
        icon: 'credit-card',
        fees: '2.5%',
        processingTime: 'Instant',
      },
    ],
    phonePrefix: '+60'
  },
  {
    name: 'Hong Kong',
    code: 'HK',
    flagUrl: 'https://flagcdn.com/hk.svg',
    currency: 'HKD',
    isSendingEnabled: true, // Adding Hong Kong as a sending country
    isReceivingEnabled: false,
    paymentMethods: [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa or Mastercard',
        icon: 'credit-card',
        fees: '2.5%',
        processingTime: 'Instant',
      },
    ],
    phonePrefix: '+852'
  },
];
