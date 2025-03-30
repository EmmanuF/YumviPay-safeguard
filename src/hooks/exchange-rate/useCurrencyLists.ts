
import { useMemo } from 'react';
import { useCountries } from '../useCountries';

export const useCurrencyLists = () => {
  const { countries, isLoading: countriesLoading } = useCountries();

  // Memoize currency lists to reduce re-calculation
  const sourceCurrencies = useMemo(() => {
    console.log("🔍 Calculating source currencies");
    
    if (!countries || countries.length === 0) {
      console.log("⚠️ No countries available for source currencies, using fallbacks");
      return ['USD', 'EUR', 'GBP'];
    }
    
    const sendingCountries = countries.filter(country => country.isSendingEnabled);
    console.log(`📤 Found ${sendingCountries.length} sending countries for source currencies`);
    
    if (sendingCountries.length > 0) {
      console.log("📋 Sample sending country:", sendingCountries[0]);
      console.log("📋 All sending countries:", sendingCountries.map(c => c.name));
    }
    
    const currencies = Array.from(new Set(
      sendingCountries.map(country => country.currency)
    ));
    
    console.log("📊 Source currencies generated:", currencies.length);
    console.log("📋 Available source currencies:", currencies);
    
    // Always include major currencies for testing if no currencies are found
    if (currencies.length === 0) {
      console.log("⚠️ No sending countries found, adding USD, EUR, GBP as defaults");
      return ['USD', 'EUR', 'GBP'];
    }
    
    return currencies;
  }, [countries]);
  
  const targetCurrencies = useMemo(() => {
    console.log("🔍 Calculating target currencies");
    
    if (!countries || countries.length === 0) {
      console.log("⚠️ No countries available for target currencies, using fallbacks");
      return ['XAF', 'NGN', 'KES'];
    }
    
    const receivingCountries = countries.filter(country => country.isReceivingEnabled);
    console.log(`📥 Found ${receivingCountries.length} receiving countries for target currencies`);
    
    if (receivingCountries.length > 0) {
      console.log("📋 Sample receiving country:", receivingCountries[0]);
    }
    
    const currencies = Array.from(new Set(
      receivingCountries.map(country => country.currency)
    ));
    
    console.log("📊 Target currencies generated:", currencies.length);
    console.log("📋 Available target currencies:", currencies);
    
    // Always ensure XAF (Cameroon currency) is available as our primary focus
    if (!currencies.includes('XAF')) {
      currencies.unshift('XAF');
    }
    
    // If still no currencies, add some African defaults
    if (currencies.length === 0) {
      console.log("⚠️ No receiving countries found, adding XAF, NGN, KES as defaults");
      return ['XAF', 'NGN', 'KES'];
    }
    
    return currencies;
  }, [countries]);

  return {
    sourceCurrencies,
    targetCurrencies,
    countriesLoading
  };
};
