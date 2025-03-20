
import { AdminCountry } from "./types";

export const parseCountryData = (data: any[]): AdminCountry[] => {
  return data.map(country => {
    let parsedMethods = [];
    try {
      parsedMethods = Array.isArray(country.payment_methods) 
        ? country.payment_methods 
        : JSON.parse(country.payment_methods?.toString() || '[]');
    } catch (e) {
      console.error(`Error parsing payment methods for ${country.code}:`, e);
    }
    
    return {
      ...country,
      payment_methods: parsedMethods
    };
  });
};
