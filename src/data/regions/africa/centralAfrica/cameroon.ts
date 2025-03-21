
import { Country } from '../../../../types/country';
import { enforceClientCountryRules } from '@/utils/countries/countryRules';

// Create the country with correct data
let cameroonCountry: Country = {
  name: 'Cameroon',
  code: 'CM',
  flagUrl: 'https://flagcdn.com/cm.svg',
  currency: 'XAF',
  isSendingEnabled: false, // This should always be false for African countries
  isReceivingEnabled: true,
  phonePrefix: '+237',
  paymentMethods: [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      description: 'Pay using Orange Money, MTN Mobile Money or other mobile wallets',
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
    }
  ],
};

// Apply country rules to ensure consistency even with mock data
cameroonCountry = enforceClientCountryRules(cameroonCountry);

// Log after rules are applied for verification
console.log('🔍 AFTER RULES APPLIED: Cameroon isSendingEnabled:', cameroonCountry.isSendingEnabled);

export { cameroonCountry };
