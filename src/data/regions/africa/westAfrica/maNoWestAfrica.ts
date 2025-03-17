
import { Country } from '../../../../types/country';

// MaNo = Mano River Union countries (Guinea, Sierra Leone, Liberia)
export const maNoWestAfricanCountries: Country[] = [
  {
    name: 'Guinea',
    code: 'GN',
    flagUrl: 'https://flagcdn.com/gn.svg',
    currency: 'GNF',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Orange Money and other mobile wallets',
        icon: 'smartphone',
        fees: '1.3%',
        processingTime: 'Instant',
      },
    ],
  },
  {
    name: 'Guinea-Bissau',
    code: 'GW',
    flagUrl: 'https://flagcdn.com/gw.svg',
    currency: 'XOF',
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
    name: 'Sierra Leone',
    code: 'SL',
    flagUrl: 'https://flagcdn.com/sl.svg',
    currency: 'SLL',
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
    name: 'Liberia',
    code: 'LR',
    flagUrl: 'https://flagcdn.com/lr.svg',
    currency: 'LRD',
    isSendingEnabled: false,
    isReceivingEnabled: true,
    paymentMethods: [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Receive to MTN mobile wallets',
        icon: 'smartphone',
        fees: '1.3%',
        processingTime: 'Instant',
      },
    ],
  },
];
