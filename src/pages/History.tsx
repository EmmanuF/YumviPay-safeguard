
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { TransactionsList } from '@/components/history';
import { SearchFilterSection } from '@/components/history/SearchFilterSection';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';

const History = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { transactions, isLoading, handleTransactionClick } = useTransactionHistory();
  const {
    searchQuery,
    statusFilter,
    dateFilter,
    countryFilter,
    filteredTransactions,
    uniqueCountries,
    hasActiveFilters,
    setSearchQuery,
    setStatusFilter,
    toggleStatusFilter,
    setDateFilter,
    toggleCountryFilter,
    resetFilters
  } = useTransactionFilters(transactions);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header title="Transaction History" showBackButton />
      
      <div className="p-4 flex-1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md mx-auto"
        >
          {/* Search and Filter Section */}
          <SearchFilterSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
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
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filteredTransactions={filteredTransactions}
          />
          
          {/* Transactions List */}
          <TransactionsList
            isLoading={isLoading}
            filteredTransactions={filteredTransactions}
            onTransactionClick={handleTransactionClick}
          />
        </motion.div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default History;
