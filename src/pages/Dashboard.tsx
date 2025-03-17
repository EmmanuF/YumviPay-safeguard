
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
import { ChevronRight, Star } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading, transactions } = useDashboard();
  const { recipients } = useRecipients();
  const navigate = useNavigate();
  
  // Item animation variants for staggered animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
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
          {/* Balance Card */}
          <BalanceCard 
            userName={user?.name} 
            transactions={transactions} 
            itemVariants={itemVariants} 
          />
          
          {/* Quick Links */}
          <QuickLinks itemVariants={itemVariants} />
          
          {/* Quick Recipients */}
          {hasQuickRecipients && (
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Quick Send</CardTitle>
                <CardDescription>
                  Send money to your favorite recipients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {favoriteRecipients.map(recipient => (
                  <div 
                    key={recipient.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => handleRecipientClick(recipient.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-primary/10 text-primary">
                        <span>{recipient.name[0]}</span>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{recipient.name}</p>
                        <p className="text-xs text-muted-foreground">{recipient.contact}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-2" />
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
                
                {recentRecipients.map(recipient => (
                  <div 
                    key={recipient.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => handleRecipientClick(recipient.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-primary/10 text-primary">
                        <span>{recipient.name[0]}</span>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{recipient.name}</p>
                        <p className="text-xs text-muted-foreground">{recipient.contact}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
                
                <div 
                  className="flex justify-center mt-2"
                  onClick={() => navigate('/recipients')}
                >
                  <span className="text-sm text-primary cursor-pointer">View all recipients</span>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Quick Transfer Panel */}
          <QuickTransferPanel />
          
          {/* Recent Transactions */}
          <RecentTransactions 
            transactions={transactions} 
            itemVariants={itemVariants} 
          />
        </DashboardContainer>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
