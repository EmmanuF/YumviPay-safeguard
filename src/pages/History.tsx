
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Transaction } from '@/types/transaction';
import { TransactionsList } from '@/components/history';
import SearchAndFilter from '@/components/history/SearchAndFilter';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import { useNetwork } from '@/contexts/NetworkContext';
import { useOfflineQuery } from '@/hooks/useOfflineQuery';
import { getAllTransactions } from '@/services/transaction';
import { OfflineStatus } from '@/components/offline';

const History = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { isOffline, offlineModeActive } = useNetwork();
  
  // Use offline-ready query for transactions with queryKey in both places
  const { 
    data: transactions = [], 
    isLoading, 
    isOfflineData,
    refetch 
  } = useOfflineQuery<Transaction[]>(
    ['transactions', 'history'],
    getAllTransactions,
    {
      queryKey: ['transactions', 'history'], // Added the queryKey here to match the type requirements
      offlineData: [],
      showOfflineToast: isOffline || offlineModeActive,
      offlineToastMessage: isOffline 
        ? "You're offline. Showing saved transactions."
        : "Offline mode active. Showing saved transactions.",
      persistOfflineData: true,
      storageKey: 'transaction_history',
    }
  );
  
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
          {/* Offline Status */}
          {(isOffline || offlineModeActive) && (
            <OfflineStatus className="mb-4" />
          )}
          
          {/* Offline Data Indicator */}
          {isOfflineData && !isOffline && !offlineModeActive && (
            <div className="mb-4 text-sm bg-blue-50 p-3 rounded-md flex items-center">
              <span className="text-blue-600">
                Showing offline data. 
                <button 
                  onClick={() => refetch()} 
                  className="ml-1 underline"
                >
                  Refresh
                </button>
              </span>
            </div>
          )}
          
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
