
import React, { ReactNode, useEffect } from 'react';
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
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg font-medium">Loading admin panel...</p>
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
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
