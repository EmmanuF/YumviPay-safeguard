import { Country } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';

/**
 * Ensure specific countries are marked as sending-enabled
 */
export const ensureSendingCountriesEnabled = (data: Country[]): Country[] => {
  const enhancedData = [...data];
  let changesMade = false;
  
  // Countries that should always be sending-enabled
  // Only USA, Canada, UK, European, and some Asian and Middle Eastern countries
  const sendingCountryCodes = [
    'US', 'CA', 'GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH', 'SE', 'NO',
    'AU', 'JP', 'SG', 'AU', 'AE', 'QA', 'SA', 'KR', 'HK', 'IE', 'DK', 'FI', 'PT'
  ];
  
  // First, disable all sending countries
  enhancedData.forEach(country => {
    if (country.isSendingEnabled) {
      country.isSendingEnabled = false;
    }
  });

  // Then enable only the specified countries
  enhancedData.forEach(country => {
    if (sendingCountryCodes.includes(country.code) && !country.isSendingEnabled) {
      country.isSendingEnabled = true;
      console.log(`🔄 Setting ${country.name} as sending-enabled`);
      changesMade = true;
    }
  });
  
  // Add any missing key countries
  sendingCountryCodes.forEach(code => {
    const exists = enhancedData.some(c => c.code === code);
    if (!exists) {
      // Add country if it's missing
      let mockCountry = mockCountries.find(c => c.code === code);
      if (mockCountry) {
        const newCountry = {
          ...mockCountry,
          isSendingEnabled: true,
          flagUrl: mockCountry.flagUrl || `https://flagcdn.com/w80/${code.toLowerCase()}.png`
        };
        enhancedData.push(newCountry);
        console.log(`➕ Adding missing sending country: ${newCountry.name}`);
        changesMade = true;
      }
    }
  });
  
  // For logging purposes, count sending countries after enhancement
  const sendingCountriesCount = enhancedData.filter(c => c.isSendingEnabled).length;
  console.log(`📤 Enhanced sending countries count: ${sendingCountriesCount}, changes made: ${changesMade}`);
  
  return enhancedData;
};

/**
 * Ensure important African countries are marked as receiving-enabled
 */
export const ensureReceivingCountriesEnabled = (data: Country[]): Country[] => {
  const enhancedData = [...data];
  let changesMade = false;
  
  // Important African countries that should always be receiving-enabled
  const receivingAfricanCodes = [
    'CM', 'NG', 'GH', 'KE', 'ZA', 'CI', 'SN', 'TZ', 'UG', 'RW', 
    'ET', 'MA', 'DZ', 'TN', 'CD', 'GA', 'TD', 'BF', 'ML', 'NE',
    'GN', 'GW', 'SL', 'LR', 'BJ', 'TG'
  ];
  
  enhancedData.forEach(country => {
    if (receivingAfricanCodes.includes(country.code) && !country.isReceivingEnabled) {
      country.isReceivingEnabled = true;
      console.log(`🔄 Setting ${country.name} as receiving-enabled (African country)`);
      changesMade = true;
    }
  });
  
  // Check if we have enough receiving countries
  const receivingCountriesCount = enhancedData.filter(c => c.isReceivingEnabled).length;
  if (receivingCountriesCount < 5) {
    // If not enough receiving countries, ensure key African countries from mock data are added
    receivingAfricanCodes.forEach(code => {
      const exists = enhancedData.some(c => c.code === code);
      if (!exists) {
        // Add country if it's missing
        let mockCountry = mockCountries.find(c => c.code === code);
        if (mockCountry) {
          const newCountry = {
            ...mockCountry,
            isReceivingEnabled: true,
            flagUrl: mockCountry.flagUrl || `https://flagcdn.com/w80/${code.toLowerCase()}.png`
          };
          enhancedData.push(newCountry);
          console.log(`➕ Adding missing African receiving country: ${newCountry.name}`);
          changesMade = true;
        }
      }
    });
  }
  
  // For logging purposes, count receiving countries after enhancement
  const finalReceivingCount = enhancedData.filter(c => c.isReceivingEnabled).length;
  console.log(`📥 Enhanced receiving countries count: ${finalReceivingCount}, changes made: ${changesMade}`);
  
  return enhancedData;
};

/**
 * Process country data to ensure all fields are correctly formatted
 */
export const processCountryData = (countries: Country[]): Country[] => {
  return countries.map(country => ({
    ...country,
    flagUrl: country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
    phonePrefix: country.phonePrefix || getDefaultPhonePrefix(country.code)
  }));
};

/**
 * Get default phone prefix for a country if not specified
 */
const getDefaultPhonePrefix = (countryCode: string): string => {
  const prefixMap: {[key: string]: string} = {
    'US': '+1', 'CA': '+1', 'GB': '+44', 'CM': '+237', 'FR': '+33', 'DE': '+49',
    'IT': '+39', 'ES': '+34', 'NL': '+31', 'BE': '+32', 'CH': '+41', 'SE': '+46',
    'NO': '+47', 'AU': '+61', 'JP': '+81', 'SG': '+65', 'NZ': '+64', 'AE': '+971',
    'QA': '+974', 'SA': '+966', 'KE': '+254', 'ZA': '+27', 'NG': '+234', 'GH': '+233',
    'IE': '+353', 'DK': '+45', 'FI': '+358', 'PT': '+351', 'KR': '+82',
    'MY': '+60', 'HK': '+852', 'CR': '+506', 'PA': '+507'
  };
  
  return prefixMap[countryCode] || '+0';
};
