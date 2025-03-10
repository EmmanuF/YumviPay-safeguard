
import React from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { TransactionStatus } from '@/types/transaction';
import FilterButton from './FilterButton';
import StatusFilter from './StatusFilter';
import DateFilter from './DateFilter';
import CountryFilter from './CountryFilter';

interface FilterPopoverProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  statusFilter: string[];
  dateFilter: string;
  countryFilter: string[];
  uniqueCountries: string[];
  setStatusFilter: (status: TransactionStatus | 'all') => void;
  toggleStatusFilter: (status: string) => void;
  setDateFilter: (date: string) => void;
  toggleCountryFilter: (country: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ 
  showFilters,
  setShowFilters,
  statusFilter,
  dateFilter,
  countryFilter,
  uniqueCountries,
  setStatusFilter,
  toggleStatusFilter,
  setDateFilter,
  toggleCountryFilter,
  resetFilters,
  hasActiveFilters
}) => {
  return (
    <Popover open={showFilters} onOpenChange={setShowFilters}>
      <PopoverTrigger asChild>
        <FilterButton 
          showFilters={showFilters} 
          setShowFilters={setShowFilters} 
          hasActiveFilters={hasActiveFilters} 
        />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filter Transactions</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-8 px-2 text-xs"
            >
              Reset
            </Button>
          </div>
          
          <StatusFilter 
            statusFilter={statusFilter} 
            toggleStatusFilter={toggleStatusFilter}
          />
          
          <DateFilter 
            dateFilter={dateFilter} 
            setDateFilter={setDateFilter}
          />
          
          <CountryFilter 
            countryFilter={countryFilter} 
            uniqueCountries={uniqueCountries} 
            toggleCountryFilter={toggleCountryFilter}
          />
          
          <div className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(false)}
              className="w-full"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
