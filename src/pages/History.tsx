
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Transaction, TransactionStatus } from '@/types/transaction';
import { 
  SearchBar, 
  FilterBadges, 
  FilterPopover, 
  TransactionsList 
} from '@/components/history';

const History = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  
  useEffect(() => {
    // Simulate loading transaction data
    const fetchTransactions = async () => {
      try {
        // In a real app, we would fetch from an API
        // This is mock data for demonstration
        const mockTransactions: Transaction[] = [
          {
            id: 'tx_123456',
            amount: '500',
            currency: 'USD',
            recipientName: 'John Doe',
            recipientCountry: 'Nigeria',
            recipientCountryCode: 'NG',
            status: 'completed',
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            type: 'send',
            createdAt: new Date(Date.now() - 86400000),
            country: 'Nigeria',
            fee: '5.00',
            totalAmount: '505.00',
            recipientContact: '+234123456789',
            recipientId: 'rec_123456',
            paymentMethod: 'bank_transfer',
            estimatedDelivery: '1-2 business days'
          },
          {
            id: 'tx_123457',
            amount: '200',
            currency: 'USD',
            recipientName: 'Sarah Johnson',
            recipientCountry: 'Kenya',
            recipientCountryCode: 'KE',
            status: 'pending',
            date: new Date().toISOString(),
            type: 'send',
            createdAt: new Date(),
            country: 'Kenya',
            fee: '3.50',
            totalAmount: '203.50',
            recipientContact: '+254987654321',
            recipientId: 'rec_123457',
            paymentMethod: 'mobile_money',
            estimatedDelivery: '1-2 business days'
          },
          {
            id: 'tx_123458',
            amount: '350',
            currency: 'USD',
            recipientName: 'Michael Brown',
            recipientCountry: 'Ghana',
            recipientCountryCode: 'GH',
            status: 'completed',
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            type: 'send',
            createdAt: new Date(Date.now() - 172800000),
            country: 'Ghana',
            fee: '4.25',
            totalAmount: '354.25',
            recipientContact: '+233123456789',
            recipientId: 'rec_123458',
            paymentMethod: 'bank_transfer',
            estimatedDelivery: '1-2 business days'
          },
          {
            id: 'tx_123459',
            amount: '100',
            currency: 'USD',
            recipientName: 'Emma Wilson',
            recipientCountry: 'Cameroon',
            recipientCountryCode: 'CM',
            status: 'failed',
            date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            type: 'send',
            createdAt: new Date(Date.now() - 259200000),
            country: 'Cameroon',
            fee: '2.50',
            totalAmount: '102.50',
            recipientContact: '+237123456789',
            recipientId: 'rec_123459',
            paymentMethod: 'mobile_money',
            estimatedDelivery: '1-2 business days',
            failureReason: 'Payment authorization failed'
          },
          {
            id: 'tx_123460',
            amount: '150',
            currency: 'USD',
            recipientName: 'James Taylor',
            recipientCountry: 'South Africa',
            recipientCountryCode: 'ZA',
            status: 'completed',
            date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            type: 'send',
            createdAt: new Date(Date.now() - 432000000),
            country: 'South Africa',
            fee: '3.00',
            totalAmount: '153.00',
            recipientContact: '+27123456789',
            recipientId: 'rec_123460',
            paymentMethod: 'bank_transfer',
            estimatedDelivery: '1-2 business days'
          },
        ];
        
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
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
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
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
  
  const handleTransactionClick = (transactionId: string) => {
    window.location.href = `/transaction/${transactionId}`;
  };
  
  const resetFilters = () => {
    setStatusFilter('all');
    setDateFilter('all');
    setCountryFilter([]);
  };
  
  const toggleCountryFilter = (country: string) => {
    if (countryFilter.includes(country)) {
      setCountryFilter(countryFilter.filter(c => c !== country));
    } else {
      setCountryFilter([...countryFilter, country]);
    }
  };
  
  // Extract unique countries for the filter
  const uniqueCountries = Array.from(new Set(
    transactions
      .map(t => t.recipientCountry || t.country)
      .filter(Boolean)
  ));
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
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
  
  // Check if any filters are active
  const hasActiveFilters = countryFilter.length > 0 || statusFilter !== 'all' || dateFilter !== 'all';
  
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
          {/* Search and Filter */}
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
