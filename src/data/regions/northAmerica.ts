
import { Country } from '../../types/country';

export const northAmericanCountries: Country[] = [
  {
    name: 'United States',
    code: 'US',
    flagUrl: 'https://flagcdn.com/us.svg',
    currency: 'USD',
    isSendingEnabled: true, // Explicitly enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+1'
  },
  {
    name: 'Canada',
    code: 'CA',
    flagUrl: 'https://flagcdn.com/ca.svg',
    currency: 'CAD',
    isSendingEnabled: true, // Explicitly enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+1'
  },
  {
    name: 'Mexico',
    code: 'MX',
    flagUrl: 'https://flagcdn.com/mx.svg',
    currency: 'MXN',
    isSendingEnabled: false, // Disabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+52'
  },
  {
    name: 'Costa Rica',
    code: 'CR',
    flagUrl: 'https://flagcdn.com/cr.svg', 
    currency: 'CRC',
    isSendingEnabled: false, // Disabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+506'
  },
  {
    name: 'Panama',
    code: 'PA',
    flagUrl: 'https://flagcdn.com/pa.svg',
    currency: 'PAB',
    isSendingEnabled: false, // Disabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+507'
  },
];
