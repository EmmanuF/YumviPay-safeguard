
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CountryFilterProps {
  countryFilter: string[];
  uniqueCountries: string[];
  toggleCountryFilter: (country: string) => void;
}

const CountryFilter: React.FC<CountryFilterProps> = ({ 
  countryFilter, 
  uniqueCountries, 
  toggleCountryFilter 
}) => {
  if (uniqueCountries.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Country</h4>
      <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
        {uniqueCountries.map((country) => (
          <div key={country} className="flex items-center space-x-2">
            <Checkbox 
              id={`country-${country}`} 
              checked={countryFilter.includes(country)}
              onCheckedChange={() => toggleCountryFilter(country)}
            />
            <Label htmlFor={`country-${country}`}>{country}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryFilter;
