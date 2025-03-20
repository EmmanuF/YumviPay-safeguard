import { Country } from '../../../../types/country';
import { cameroonCountry } from './cameroon';

// Create a properly mapped array to ensure flags are consistent
export const centralAfricanCountries: Country[] = [
  {
    ...cameroonCountry,
    isSendingEnabled: false,  // Explicitly force to false
    isReceivingEnabled: true
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
    phonePrefix: '+241',
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
    phonePrefix: '+235',
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
    phonePrefix: '+236',
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
    phonePrefix: '+240',
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
    phonePrefix: '+242',
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
].map(country => {
  // Add debug logging for each country
  console.log(`🔍 CENTRAL AFRICA MAPPED: ${country.name}: isSendingEnabled=${country.isSendingEnabled}`);
  return country;
});

// Final validation of the array
console.log('🔍 CENTRAL AFRICA: Final array check - centralAfricanCountries:');
centralAfricanCountries.forEach(c => {
  console.log(`🔍 CENTRAL AFRICA FINAL: ${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});
