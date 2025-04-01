
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { TransactionsList } from '@/components/history';
import { useTransactions } from '@/hooks/useTransactions';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import SearchAndFilter from '@/components/history/SearchAndFilter';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { SendHorizonal, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const TransactionHistory: React.FC = () => {
  const { transactions, loading, refreshTransactions } = useTransactions();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  
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
  
  // Add automatic refresh when page loads
  useEffect(() => {
    refreshTransactions().catch(err => {
      console.error('Failed to refresh transactions:', err);
    });
  }, [refreshTransactions]);

  const handleTransactionClick = (transactionId: string) => {
    navigate(`/transaction/${transactionId}`);
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
  
  const handleRefresh = async () => {
    try {
      toast({
        title: "Refreshing transactions...",
        duration: 2000,
      });
      await refreshTransactions();
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <motion.main 
          className="flex-1 p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="space-y-4 max-w-md mx-auto"
            variants={itemVariants}
          >
            {/* Quick Actions Card */}
            <motion.div variants={itemVariants} className="mb-4">
              <Card className="shadow-sm border-0 glass-effect">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center gap-3">
                    <Button 
                      onClick={() => navigate('/send')}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      size="lg"
                    >
                      <SendHorizonal className="mr-2 h-5 w-5" />
                      Send Money
                    </Button>
                    <Button 
                      onClick={() => navigate('/recipients')}
                      className="flex-1 bg-secondary hover:bg-secondary/90 text-white"
                      size="lg"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Recipients
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Transaction History</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefresh} 
                  disabled={loading}
                >
                  Refresh
                </Button>
              </div>
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
            
            {/* Empty state with call to action */}
            {!loading && filteredTransactions.length === 0 && !hasActiveFilters && (
              <motion.div 
                variants={itemVariants}
                className="text-center py-8 glass-effect rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold mb-3">No transactions yet</h3>
                <p className="text-gray-500 mb-6">Start sending money to see your transaction history</p>
                <Button
                  onClick={() => navigate('/send')}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <SendHorizonal className="mr-2 h-5 w-5" />
                  Send Your First Transfer
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.main>
      </div>
    </PageTransition>
  );
};

export default TransactionHistory;
