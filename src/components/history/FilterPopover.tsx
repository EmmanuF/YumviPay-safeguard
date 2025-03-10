
import React from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { TransactionStatus } from '@/types/transaction';
import FilterButton from './FilterButton';

interface FilterPopoverProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  statusFilter: TransactionStatus | 'all';
  dateFilter: string;
  countryFilter: string[];
  uniqueCountries: string[];
  setStatusFilter: (status: TransactionStatus | 'all') => void;
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
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Status</h4>
            <RadioGroup value={statusFilter} onValueChange={(value) => setStatusFilter(value as TransactionStatus | 'all')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="status-all" />
                <Label htmlFor="status-all">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="status-completed" />
                <Label htmlFor="status-completed">Completed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="status-pending" />
                <Label htmlFor="status-pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="failed" id="status-failed" />
                <Label htmlFor="status-failed">Failed</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Date</h4>
            <RadioGroup value={dateFilter} onValueChange={setDateFilter}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="date-all" />
                <Label htmlFor="date-all">All time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="today" id="date-today" />
                <Label htmlFor="date-today">Today</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="date-week" />
                <Label htmlFor="date-week">Last 7 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="date-month" />
                <Label htmlFor="date-month">Last 30 days</Label>
              </div>
            </RadioGroup>
          </div>
          
          {uniqueCountries.length > 0 && (
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
          )}
          
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
