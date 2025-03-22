
import { Country } from '../types/country';

export const northAmericanCountries: Country[] = [
  {
    name: 'United States',
    code: 'US',
    flagUrl: 'https://flagcdn.com/us.svg',
    currency: 'USD',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
  },
  {
    name: 'Canada',
    code: 'CA',
    flagUrl: 'https://flagcdn.com/ca.svg',
    currency: 'CAD',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
  },
  {
    name: 'Mexico',
    code: 'MX',
    flagUrl: 'https://flagcdn.com/mx.svg',
    currency: 'MXN',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
  },
];
