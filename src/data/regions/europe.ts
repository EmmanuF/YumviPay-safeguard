
import { Country } from '../../types/country';

export const europeanCountries: Country[] = [
  {
    name: 'United Kingdom',
    code: 'GB',
    flagUrl: 'https://flagcdn.com/gb.svg',
    currency: 'GBP',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+44'
  },
  {
    name: 'France',
    code: 'FR',
    flagUrl: 'https://flagcdn.com/fr.svg',
    currency: 'EUR',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+33'
  },
  {
    name: 'Germany',
    code: 'DE',
    flagUrl: 'https://flagcdn.com/de.svg',
    currency: 'EUR',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+49'
  },
  {
    name: 'Italy',
    code: 'IT',
    flagUrl: 'https://flagcdn.com/it.svg',
    currency: 'EUR',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+39'
  },
  {
    name: 'Spain',
    code: 'ES',
    flagUrl: 'https://flagcdn.com/es.svg',
    currency: 'EUR',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+34'
  },
  {
    name: 'Netherlands',
    code: 'NL',
    flagUrl: 'https://flagcdn.com/nl.svg',
    currency: 'EUR',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+31'
  },
  {
    name: 'Belgium',
    code: 'BE',
    flagUrl: 'https://flagcdn.com/be.svg',
    currency: 'EUR',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+32'
  },
  {
    name: 'Switzerland',
    code: 'CH',
    flagUrl: 'https://flagcdn.com/ch.svg',
    currency: 'CHF',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+41'
  },
  {
    name: 'Sweden',
    code: 'SE',
    flagUrl: 'https://flagcdn.com/se.svg',
    currency: 'SEK',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+46'
  },
  {
    name: 'Norway',
    code: 'NO',
    flagUrl: 'https://flagcdn.com/no.svg',
    currency: 'NOK',
    isSendingEnabled: true, // Enabled for sending
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+47'
  },
  {
    name: 'Ireland',
    code: 'IE',
    flagUrl: 'https://flagcdn.com/ie.svg',
    currency: 'EUR',
    isSendingEnabled: true, // Adding Ireland as a sending country
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+353'
  },
  {
    name: 'Denmark',
    code: 'DK',
    flagUrl: 'https://flagcdn.com/dk.svg',
    currency: 'DKK',
    isSendingEnabled: true, // Adding Denmark as a sending country
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+45'
  },
  {
    name: 'Finland',
    code: 'FI',
    flagUrl: 'https://flagcdn.com/fi.svg',
    currency: 'EUR',
    isSendingEnabled: true, // Adding Finland as a sending country
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+358'
  },
  {
    name: 'Portugal',
    code: 'PT',
    flagUrl: 'https://flagcdn.com/pt.svg',
    currency: 'EUR',
    isSendingEnabled: true, // Adding Portugal as a sending country
    isReceivingEnabled: false,
    paymentMethods: [],
    phonePrefix: '+351'
  },
];
