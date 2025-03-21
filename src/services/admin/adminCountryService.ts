
/**
 * @deprecated Use the modular implementation from @/services/admin/countries instead
 * This file is kept for backward compatibility and will be removed in future versions
 */

import { 
  AdminCountry as ModularAdminCountry,
  getAdminCountries as modularGetAdminCountries,
  updateCountrySettings as modularUpdateCountrySettings,
  updateCountryPaymentMethods as modularUpdateCountryPaymentMethods,
  addNewCountry as modularAddNewCountry,
  getCountryByCode as modularGetCountryByCode,
  deleteCountry as modularDeleteCountry
} from './countries';

// Re-export types with the same interface
export interface AdminCountry extends ModularAdminCountry {}

// Re-export functions from the modular implementation
export const getAdminCountries = modularGetAdminCountries;
export const updateCountrySettings = modularUpdateCountrySettings;
export const updateCountryPaymentMethods = modularUpdateCountryPaymentMethods;
export const addNewCountry = modularAddNewCountry;
export const getCountryByCode = modularGetCountryByCode;
export const deleteCountry = modularDeleteCountry;
