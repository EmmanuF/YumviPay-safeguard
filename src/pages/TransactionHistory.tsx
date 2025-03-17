
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import { TransactionsList } from '@/components/history';
import { useTransactions } from '@/hooks/useTransactions';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import SearchAndFilter from '@/components/history/SearchAndFilter';
import { useIsMobile } from '@/hooks/use-mobile';

const TransactionHistory: React.FC = () => {
  const { transactions, loading, refreshTransactions } = useTransactions();
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(false);
  
  // Use the transaction filters hook
  const {
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
    filteredTransactions
  } = useTransactionFilters(transactions);

  const handleTransactionClick = (transactionId: string) => {
    window.location.href = `/transaction/${transactionId}`;
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: isMobile ? 200 : 260,
        damping: isMobile ? 25 : 20,
      }
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Header title="Transaction History" showBackButton />
        
        <motion.main 
          className="flex-1 p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="space-y-4 max-w-4xl mx-auto"
            variants={itemVariants}
          >
            <motion.div variants={itemVariants}>
              <SearchAndFilter 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
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
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <TransactionsList 
                filteredTransactions={filteredTransactions}
                isLoading={loading}
                onTransactionClick={handleTransactionClick}
              />
            </motion.div>
          </motion.div>
        </motion.main>
      </div>
    </PageTransition>
  );
};

export default TransactionHistory;
