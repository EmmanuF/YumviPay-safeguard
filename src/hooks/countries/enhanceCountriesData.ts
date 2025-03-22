
import { Country } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';

/**
 * Ensure specific countries are marked as sending-enabled
 */
export const ensureSendingCountriesEnabled = (data: Country[]): Country[] => {
  const enhancedData = [...data];
  let changesMade = false;
  
  // Countries that should always be sending-enabled
  const sendingCountryCodes = ['US', 'CA', 'GB', 'CM'];
  
  enhancedData.forEach(country => {
    if (sendingCountryCodes.includes(country.code) && !country.isSendingEnabled) {
      country.isSendingEnabled = true;
      console.log(`🔄 Setting ${country.name} as sending-enabled`);
      changesMade = true;
    }
  });
  
  // If no sending countries exist at all, enable key countries
  const hasSendingCountries = enhancedData.some(c => c.isSendingEnabled);
  if (!hasSendingCountries) {
    enhancedData.forEach(country => {
      if (sendingCountryCodes.includes(country.code)) {
        country.isSendingEnabled = true;
        console.log(`🔄 Setting ${country.name} as sending-enabled (fallback)`);
        changesMade = true;
      }
    });
  }
  
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
 * Process country data to ensure all fields are correctly formatted
 */
export const processCountryData = (countries: Country[]): Country[] => {
  return countries.map(country => ({
    ...country,
    flagUrl: country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`
  }));
};
