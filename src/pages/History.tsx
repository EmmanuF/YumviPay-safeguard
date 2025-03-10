
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Transaction } from '@/types/transaction';
import { TransactionsList } from '@/components/history';
import SearchAndFilter from '@/components/history/SearchAndFilter';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import { getHistoryMockTransactions } from '@/data/historyMockTransactions';

const History = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Use our custom hook for filtering
  const {
    filteredTransactions,
    searchQuery,
    setSearchQuery,
    statusFilter,
    dateFilter,
    countryFilter,
    setStatusFilter,
    toggleStatusFilter,
    setDateFilter,
    toggleCountryFilter,
    resetFilters,
    uniqueCountries,
    hasActiveFilters
  } = useTransactionFilters(transactions);
  
  useEffect(() => {
    // Simulate loading transaction data
    const fetchTransactions = async () => {
      try {
        // In a real app, we would fetch from an API
        // For now, use our mock data
        const mockTransactions = getHistoryMockTransactions();
        setTransactions(mockTransactions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  const handleTransactionClick = (transactionId: string) => {
    window.location.href = `/transaction/${transactionId}`;
  };
  
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
          {/* Search and Filter Component */}
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
