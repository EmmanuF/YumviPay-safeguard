
import React from 'react';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import FilterPopover from './FilterPopover';
import FilterBadges from './FilterBadges';
import ExportButton from './ExportButton';
import { TransactionStatus } from '@/types/transaction';

interface SearchFilterSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filteredTransactions: any[];
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const SearchFilterSection: React.FC<SearchFilterSectionProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  dateFilter,
  countryFilter,
  uniqueCountries,
  setStatusFilter,
  toggleStatusFilter,
  setDateFilter,
  toggleCountryFilter,
  resetFilters,
  hasActiveFilters,
  showFilters,
  setShowFilters,
  filteredTransactions
}) => {
  return (
    <motion.div variants={itemVariants} className="mb-6">
      <div className="flex gap-2">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
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
        
        <ExportButton transactions={filteredTransactions} />
      </div>
      
      {/* Active filters */}
      <FilterBadges
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        countryFilter={countryFilter}
        setStatusFilter={setStatusFilter}
        setDateFilter={setDateFilter}
        toggleCountryFilter={toggleCountryFilter}
      />
    </motion.div>
  );
};
