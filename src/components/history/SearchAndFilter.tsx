
import React from 'react';
import { motion } from 'framer-motion';
import { SearchBar, FilterBadges, FilterPopover } from '@/components/history';
import { TransactionStatus } from '@/types/transaction';
import { useLocale } from '@/contexts/LocaleContext';

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
  const { t } = useLocale();
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

export default SearchAndFilter;
