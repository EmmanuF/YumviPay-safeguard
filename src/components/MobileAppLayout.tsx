
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import OfflineBanner from './OfflineBanner';
import { Toaster } from 'sonner';

interface MobileAppLayoutProps {
  children?: ReactNode;
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <OfflineBanner />
      
      {!isHome && <Header />}
      
      <main className="flex-1 overflow-auto">
        {children || <Outlet />}
      </main>
      
      <Toaster position="top-center" />
    </div>
  );
};

export default MobileAppLayout;
