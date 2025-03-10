
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import TransactionCard from '@/components/TransactionCard';
import { Transaction, TransactionStatus } from '@/types/transaction';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className={countryFilter.length > 0 || statusFilter !== 'all' || dateFilter !== 'all' 
                      ? "bg-primary text-primary-foreground" 
                      : ""}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Filter Transactions</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={resetFilters}
                        className="h-8 px-2 text-xs"
                      >
                        Reset
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Status</h4>
                      <RadioGroup value={statusFilter} onValueChange={(value) => setStatusFilter(value as TransactionStatus | 'all')}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="status-all" />
                          <Label htmlFor="status-all">All</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="completed" id="status-completed" />
                          <Label htmlFor="status-completed">Completed</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pending" id="status-pending" />
                          <Label htmlFor="status-pending">Pending</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="failed" id="status-failed" />
                          <Label htmlFor="status-failed">Failed</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Date</h4>
                      <RadioGroup value={dateFilter} onValueChange={setDateFilter}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="date-all" />
                          <Label htmlFor="date-all">All time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="today" id="date-today" />
                          <Label htmlFor="date-today">Today</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="week" id="date-week" />
                          <Label htmlFor="date-week">Last 7 days</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="month" id="date-month" />
                          <Label htmlFor="date-month">Last 30 days</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {uniqueCountries.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Country</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                          {uniqueCountries.map((country) => (
                            <div key={country} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`country-${country}`} 
                                checked={countryFilter.includes(country)}
                                onCheckedChange={() => toggleCountryFilter(country)}
                              />
                              <Label htmlFor={`country-${country}`}>{country}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowFilters(false)}
                        className="w-full"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Active filters */}
            {(countryFilter.length > 0 || statusFilter !== 'all' || dateFilter !== 'all') && (
              <div className="flex flex-wrap gap-2 mt-3">
                {statusFilter !== 'all' && (
                  <Badge 
                    variant="outline" 
                    className="bg-primary/10 text-xs py-0 h-6"
                    onClick={() => setStatusFilter('all')}
                  >
                    Status: {statusFilter}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                
                {dateFilter !== 'all' && (
                  <Badge 
                    variant="outline"
                    className="bg-primary/10 text-xs py-0 h-6"
                    onClick={() => setDateFilter('all')}
                  >
                    Date: {dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'Last 7 days' : 'Last 30 days'}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                
                {countryFilter.map(country => (
                  <Badge 
                    key={country}
                    variant="outline"
                    className="bg-primary/10 text-xs py-0 h-6"
                    onClick={() => toggleCountryFilter(country)}
                  >
                    {country}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
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
