
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import TransactionCard, { Transaction } from '@/components/TransactionCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const History = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
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
            country: 'Nigeria'
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
            country: 'Kenya'
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
            country: 'Ghana'
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
            country: 'Cameroon'
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
            country: 'South Africa'
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
    if (searchQuery.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(transaction => 
        transaction.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.recipientCountry && transaction.recipientCountry.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredTransactions(filtered);
    }
  }, [searchQuery, transactions]);
  
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
  
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: Record<string, Transaction[]> = {};
    
    transactions.forEach(transaction => {
      const dateStr = transaction.date ? new Date(transaction.date).toDateString() : 
                       transaction.createdAt.toDateString();
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      
      groups[dateStr].push(transaction);
    });
    
    return Object.entries(groups).map(([date, transactions]) => ({
      date,
      transactions,
    }));
  };
  
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);
  
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
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search recipient or country"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          
          {/* Transactions */}
          {isLoading ? (
            <motion.div variants={itemVariants} className="text-center py-8">
              <div className="animate-pulse-subtle">Loading transactions...</div>
            </motion.div>
          ) : filteredTransactions.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center py-8">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">No transactions found</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div>
              {groupedTransactions.map((group, index) => (
                <motion.div key={group.date} variants={itemVariants}>
                  <div className="mb-2 mt-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      {new Date(group.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <Separator className="mt-1" />
                  </div>
                  
                  {group.transactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                      onClick={() => handleTransactionClick(transaction.id)}
                    />
                  ))}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default History;
