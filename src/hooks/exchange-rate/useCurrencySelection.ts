
import { useState, useEffect } from 'react';

/**
 * Hook to manage currency selection logic
 */
export const useCurrencySelection = (
  sendingCountryList: string[],
  receivingCountryList: string[]
) => {
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('XAF'); // Set Cameroon's currency as default

  // Set default currencies if the selected ones aren't available
  useEffect(() => {
    // If the source currency isn't in the sending list, reset it to USD or first available
    if (sendingCountryList.length > 0) {
      if (!sendingCountryList.includes(sourceCurrency)) {
        const defaultCurrency = sendingCountryList.includes('USD') ? 'USD' : sendingCountryList[0];
        console.log(`Resetting source currency to ${defaultCurrency}`);
        setSourceCurrency(defaultCurrency);
      } else {
        console.log(`Keeping source currency as ${sourceCurrency}`);
      }
    } else {
      console.warn('No sending currencies available!');
    }
    
    // If the target currency isn't in the receiving list, reset it to XAF or first available
    if (receivingCountryList.length > 0) {
      if (!receivingCountryList.includes(targetCurrency)) {
        const defaultCurrency = receivingCountryList.includes('XAF') ? 'XAF' : receivingCountryList[0];
        console.log(`Resetting target currency to ${defaultCurrency}`);
        setTargetCurrency(defaultCurrency);
      } else {
        console.log(`Keeping target currency as ${targetCurrency}`);
      }
    } else {
      console.warn('No receiving currencies available!');
    }
  }, [sendingCountryList, receivingCountryList, sourceCurrency, targetCurrency]);

  return {
    sourceCurrency,
    setSourceCurrency,
    targetCurrency,
    setTargetCurrency
  };
};
