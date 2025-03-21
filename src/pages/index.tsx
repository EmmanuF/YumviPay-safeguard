
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import HomeActions from '@/components/home/HomeActions';
import QuickSend from '@/components/home/QuickSend';
import RecentActivity from '@/components/home/RecentActivity';
import BottomNavigation from '@/components/BottomNavigation';
import AdminControls from '@/components/admin/AdminControls';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Determine if user is admin (example check, adjust as needed)
  const isAdmin = user?.email?.endsWith('@admin.com') || process.env.NODE_ENV === 'development';
  
  // Re-enable country features as we've fixed the specific issue with currency flags
  const disableCountryFeatures = false; 

  return (
    <PageTransition>
      <div className="pb-20 md:pb-0 px-4 pt-4 bg-gray-50 min-h-screen">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Quick stats & actions */}
          <HomeActions />
          
          {/* Quick send section */}
          <QuickSend className="mt-6" />
          
          {/* Recent activity */}
          <RecentActivity className="mt-6" />
          
          {/* Admin controls for debugging - only visible in development */}
          {process.env.NODE_ENV === 'development' && (
            <AdminControls 
              className="mt-6" 
              disableCountryFeatures={disableCountryFeatures} 
            />
          )}
        </div>
        
        <BottomNavigation />
      </div>
    </PageTransition>
  );
};

export default HomePage;
