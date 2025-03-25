
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCountries as useCountriesCore } from './countries';
export type { Country, PaymentMethod } from './countries';

// Create context
const CountriesContext = createContext<ReturnType<typeof useCountriesCore> | undefined>(undefined);

// Provider component
export const CountriesProvider = ({ children }: { children: ReactNode }) => {
  const countriesData = useCountriesCore();
  
  return (
    <CountriesContext.Provider value={countriesData}>
      {children}
    </CountriesContext.Provider>
  );
};

// Export the hook with context
export const useCountries = () => {
  const context = useContext(CountriesContext);
  
  // If outside provider, use the core hook directly
  if (context === undefined) {
    return useCountriesCore();
  }
  
  return context;
};
