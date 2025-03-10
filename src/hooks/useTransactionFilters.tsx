
import { useState, useEffect } from 'react';
import { Transaction, TransactionStatus } from '@/types/transaction';

export const useTransactionFilters = (transactions: Transaction[]) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilterState] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  
  // Convert single status to array or clear the array
  const setStatusFilter = (status: TransactionStatus | 'all') => {
    if (status === 'all') {
      setStatusFilterState([]);
    } else {
      setStatusFilterState([status]);
    }
  };
  
  // Toggle a status in the filter array
  const toggleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilterState(statusFilter.filter(s => s !== status));
    } else {
      setStatusFilterState([...statusFilter, status]);
    }
  };
  
  // Toggle a country in the filter array
  const toggleCountryFilter = (country: string) => {
    if (countryFilter.includes(country)) {
      setCountryFilter(countryFilter.filter(c => c !== country));
    } else {
      setCountryFilter([...countryFilter, country]);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setStatusFilterState([]);
    setDateFilter('all');
    setCountryFilter([]);
  };
  
  // Extract unique countries for the filter
  const uniqueCountries = Array.from(new Set(
    transactions
      .map(t => t.recipientCountry || t.country)
      .filter(Boolean)
  ));
  
  // Check if any filters are active
  const hasActiveFilters = countryFilter.length > 0 || statusFilter.length > 0 || dateFilter !== 'all';
  
  useEffect(() => {
    // Filter the transactions based on search query and filters
    let filtered = [...transactions];
    
    // Apply search query filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(transaction => 
        transaction.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.recipientCountry && transaction.recipientCountry.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply status filter - updated to work with array of statuses
    if (statusFilter.length > 0) {
      filtered = filtered.filter(transaction => statusFilter.includes(transaction.status));
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const dayInMs = 24 * 60 * 60 * 1000;
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(transaction => {
            const txDate = new Date(transaction.createdAt);
            return txDate.toDateString() === now.toDateString();
          });
          break;
        case 'week':
          filtered = filtered.filter(transaction => {
            const txDate = new Date(transaction.createdAt);
            return (now.getTime() - txDate.getTime()) <= 7 * dayInMs;
          });
          break;
        case 'month':
          filtered = filtered.filter(transaction => {
            const txDate = new Date(transaction.createdAt);
            return (now.getTime() - txDate.getTime()) <= 30 * dayInMs;
          });
          break;
      }
    }
    
    // Apply country filter
    if (countryFilter.length > 0) {
      filtered = filtered.filter(transaction => {
        const country = transaction.recipientCountry || transaction.country;
        return countryFilter.includes(country);
      });
    }
    
    setFilteredTransactions(filtered);
  }, [searchQuery, transactions, statusFilter, dateFilter, countryFilter]);
  
  return {
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
  };
};
