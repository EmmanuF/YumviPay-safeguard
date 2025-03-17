
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import FilterButton from './FilterButton';
import FilterPopover from './FilterPopover';
import FilterBadges from './FilterBadges';
import { TransactionStatus } from '@/types/transaction';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery, 
  setSearchQuery, 
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
    <div className="space-y-2">
      <div className="flex gap-2">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        <FilterButton 
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
      
      {showFilters && (
        <FilterPopover
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          countryFilter={countryFilter}
          uniqueCountries={uniqueCountries}
          setStatusFilter={setStatusFilter}
          toggleStatusFilter={toggleStatusFilter}
          setDateFilter={setDateFilter}
          toggleCountryFilter={toggleCountryFilter}
          resetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
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
