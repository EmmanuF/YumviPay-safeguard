
import React, { ReactNode, useEffect, useState, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, isLoggedIn, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  
  // Check if the user is an admin
  const isAdmin = isLoggedIn && user?.email?.endsWith('@yumvipay.com');
  
  // Add detailed logging to help diagnose issues
  useEffect(() => {
    console.log('AdminLayout auth state:', {
      isLoggedIn,
      userEmail: user?.email,
      isAdmin,
      loading
    });
  }, [isLoggedIn, user, isAdmin, loading]);
  
  // Optimize client-side rendering
  useEffect(() => {
    // Delay setting client ready to ensure smooth loading
    const timer = setTimeout(() => {
      setIsClientReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading || !isClientReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-lg font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  // Redirect non-admin users to the home page
  if (!isAdmin) {
    console.log('Not an admin in AdminLayout, redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={setSidebarCollapsed} />
      <div 
        className={`flex flex-col flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 ease-in-out`}
      >
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
