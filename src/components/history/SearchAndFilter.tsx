
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import FilterButton from './FilterButton';
import FilterPopover from './FilterPopover';
import FilterBadges from './FilterBadges';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';

const SearchAndFilter: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter,
    dateFilter, 
    setDateFilter,
    countryFilter,
    toggleCountryFilter,
    uniqueCountries,
    hasActiveFilters
  } = useTransactionFilters();

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <SearchBar 
          query={searchQuery} 
          onChange={setSearchQuery} 
        />
        <FilterButton 
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
      
      {showFilters && (
        <FilterPopover
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          countryFilter={countryFilter}
          toggleCountryFilter={toggleCountryFilter}
          uniqueCountries={uniqueCountries}
        />
      )}
      
      <FilterBadges
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        countryFilter={countryFilter}
        setStatusFilter={setStatusFilter}
        setDateFilter={setDateFilter}
        toggleCountryFilter={toggleCountryFilter}
      />
    </div>
  );
};

export default SearchAndFilter;
