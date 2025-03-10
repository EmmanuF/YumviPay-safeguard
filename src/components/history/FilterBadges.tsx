
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TransactionStatus } from '@/types/transaction';

interface FilterBadgesProps {
  statusFilter: TransactionStatus | 'all';
  dateFilter: string;
  countryFilter: string[];
  setStatusFilter: (status: TransactionStatus | 'all') => void;
  setDateFilter: (date: string) => void;
  toggleCountryFilter: (country: string) => void;
}

const FilterBadges: React.FC<FilterBadgesProps> = ({ 
  statusFilter, 
  dateFilter, 
  countryFilter, 
  setStatusFilter, 
  setDateFilter, 
  toggleCountryFilter 
}) => {
  if (statusFilter === 'all' && dateFilter === 'all' && countryFilter.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {statusFilter !== 'all' && (
        <Badge 
          variant="outline" 
          className="bg-primary/10 text-xs py-0 h-6"
          onClick={() => setStatusFilter('all')}
        >
          Status: {statusFilter}
          <X className="ml-1 h-3 w-3" />
        </Badge>
      )}
      
      {dateFilter !== 'all' && (
        <Badge 
          variant="outline"
          className="bg-primary/10 text-xs py-0 h-6"
          onClick={() => setDateFilter('all')}
        >
          Date: {dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'Last 7 days' : 'Last 30 days'}
          <X className="ml-1 h-3 w-3" />
        </Badge>
      )}
      
      {countryFilter.map(country => (
        <Badge 
          key={country}
          variant="outline"
          className="bg-primary/10 text-xs py-0 h-6"
          onClick={() => toggleCountryFilter(country)}
        >
          {country}
          <X className="ml-1 h-3 w-3" />
        </Badge>
      ))}
    </div>
  );
};

export default FilterBadges;
