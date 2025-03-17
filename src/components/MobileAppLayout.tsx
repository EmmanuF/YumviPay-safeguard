
import React, { ReactNode } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import OfflineBanner from '@/components/OfflineBanner';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileAppLayoutProps {
  children: ReactNode;
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <OfflineBanner />
      
      {/* Main content */}
      <div className="flex-1 pb-16">
        {children}
      </div>
      
      {/* FloatingLanguageSwitcher - only visible on mobile */}
      {isMobile && (
        <div className="fixed top-4 right-4 z-40">
          <LocaleSwitcher />
        </div>
      )}
      
      {/* Bottom Navigation - only visible on mobile */}
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default MobileAppLayout;
