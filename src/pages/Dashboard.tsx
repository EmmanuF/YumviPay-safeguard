
import React from 'react';
import HeaderRight from '@/components/HeaderRight';
import QuickTransferPanel from '@/components/quick-transfer/QuickTransferPanel';
import { BalanceCard, QuickLinks, RecentTransactions } from '@/components/dashboard';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import LoadingState from '@/components/dashboard/LoadingState';
import { useDashboard } from '@/hooks/useDashboard';
import PageTransition from '@/components/PageTransition';
import { useRecipients } from '@/hooks/useRecipients';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, isLoading, transactions } = useDashboard();
  const { recipients } = useRecipients();
  const navigate = useNavigate();
  
  // Enhanced animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };
  
  // Enhanced item animation variants for smoother transitions
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    },
  };
  
  // Get favorites and recently used recipients
  const favoriteRecipients = recipients
    .filter(r => r.isFavorite)
    .sort((a, b) => {
      const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
      const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);
  
  const recentRecipients = recipients
    .sort((a, b) => {
      const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
      const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
      return dateB - dateA;
    })
    .filter(r => !r.isFavorite)
    .slice(0, 2);
  
  const hasQuickRecipients = favoriteRecipients.length > 0 || recentRecipients.length > 0;
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  const handleRecipientClick = (recipientId: string) => {
    navigate('/send', { state: { selectedRecipientId: recipientId } });
  };
  
  return (
    <PageTransition>
      <div className="flex flex-col">
        <DashboardContainer>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Balance Card */}
            <motion.div variants={itemVariants}>
              <BalanceCard 
                userName={user?.name} 
                transactions={transactions} 
                itemVariants={itemVariants} 
              />
            </motion.div>
            
            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <QuickLinks itemVariants={itemVariants} />
            </motion.div>
            
            {/* Quick Recipients */}
            {hasQuickRecipients && (
              <motion.div variants={itemVariants}>
                <Card className="mb-4 overflow-hidden shadow-lg border-0 glass-effect">
                  <CardHeader className="pb-2 bg-gradient-to-r from-primary-50 to-secondary-50">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-primary-600" />
                      <CardTitle className="text-lg font-medium">Quick Send</CardTitle>
                    </div>
                    <CardDescription>
                      Send money to your favorite recipients
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4">
                    {favoriteRecipients.map(recipient => (
                      <motion.div 
                        key={recipient.id}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-primary-50 cursor-pointer transition-all duration-200"
                        onClick={() => handleRecipientClick(recipient.id)}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 bg-primary-100 text-primary border-2 border-white shadow-sm">
                            <span className="text-lg font-semibold">{recipient.name[0]}</span>
                          </Avatar>
                          <div className="text-left">
                            <p className="text-sm font-medium">{recipient.name}</p>
                            <p className="text-xs text-muted-foreground">{recipient.contact}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-2" />
                          <ChevronRight className="h-4 w-4 text-primary-400" />
                        </div>
                      </motion.div>
                    ))}
                    
                    {recentRecipients.map(recipient => (
                      <motion.div 
                        key={recipient.id}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-primary-50 cursor-pointer transition-all duration-200"
                        onClick={() => handleRecipientClick(recipient.id)}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 bg-secondary-100 text-secondary border-2 border-white shadow-sm">
                            <span className="text-lg font-semibold">{recipient.name[0]}</span>
                          </Avatar>
                          <div className="text-left">
                            <p className="text-sm font-medium">{recipient.name}</p>
                            <p className="text-xs text-muted-foreground">{recipient.contact}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-secondary-400" />
                      </motion.div>
                    ))}
                    
                    <motion.div 
                      className="flex justify-center mt-4"
                      onClick={() => navigate('/recipients')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-sm text-primary font-medium px-4 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors cursor-pointer">View all recipients</span>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Quick Transfer Panel */}
            <motion.div variants={itemVariants}>
              <QuickTransferPanel />
            </motion.div>
            
            {/* Recent Transactions */}
            <motion.div variants={itemVariants}>
              <RecentTransactions 
                transactions={transactions} 
                itemVariants={itemVariants} 
              />
            </motion.div>
          </motion.div>
        </DashboardContainer>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
