
import { Country } from '../../types/country';

// Cache countries data in memory to avoid repeated fetches
let countriesCache: Country[] | null = null;
let cacheTimestamp: number = 0;
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getCachedCountries = (): Country[] | null => {
  if (countriesCache && (Date.now() - cacheTimestamp) < CACHE_TTL) {
    console.log('Using cached countries data');
    return countriesCache;
  }
  return null;
};

export const updateCountriesCache = (countries: Country[]): void => {
  countriesCache = countries;
  cacheTimestamp = Date.now();
};
