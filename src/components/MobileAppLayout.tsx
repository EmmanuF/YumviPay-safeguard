
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import OfflineBanner from './OfflineBanner';
import { Toaster } from 'sonner';

const MobileAppLayout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <OfflineBanner />
      
      {!isHome && <Header />}
      
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      
      <Toaster position="top-center" />
    </div>
  );
};

export default MobileAppLayout;
