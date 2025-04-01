
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Shield, Bug, ChevronLeft } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { isPlatform } from '@/utils/platform';
import { grantAdminRole } from '@/utils/admin/adminRoles';
import { useToast } from '@/components/ui/use-toast';

export interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightContent?: React.ReactNode;
  rightElement?: React.ReactNode;
  transparent?: boolean;
  showNotification?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title,
  showBackButton,
  onBackClick,
  rightContent,
  rightElement,
  transparent,
  showNotification
}) => {
  const { isLoggedIn, user, signOut } = useAuth();
  const { isAdmin, isLoading: adminLoading, refreshAdminStatus } = useAdmin();
  const isNativeApp = isPlatform('native');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDebug, setShowDebug] = useState(false);
  
  // Don't render the Header component on auth pages
  const isAuthPage = location.pathname === '/signin' || 
                    location.pathname === '/signup' || 
                    location.pathname === '/forgot-password' || 
                    location.pathname === '/reset-password';

  if (isAuthPage) {
    return null;
  }
  
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
  };

  const handleGrantAdmin = async () => {
    if (user) {
      try {
        const result = await grantAdminRole(user.id);
        if (result) {
          toast({
            title: "Success",
            description: "Admin role granted successfully!"
          });
          await refreshAdminStatus();
        } else {
          toast({
            title: "Error",
            description: "Failed to grant admin role",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive"
        });
      }
    }
  };
  
  const toggleDebug = () => setShowDebug(prev => !prev);
  
  return (
    <header className={`${transparent ? 'bg-transparent' : 'bg-white'} shadow-md py-4 px-6 flex items-center justify-between`}>
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={handleBackClick}
            className="mr-3 p-1 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        
        {!showBackButton && (
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Yumvi-Pay
          </Link>
        )}
        
        {title && (
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        )}
      </div>
      
      <nav className="flex items-center">
        {rightContent && rightContent}
        {rightElement && rightElement}
        
        {isLoggedIn && (
          <>
            {/* Debug section */}
            {showDebug && (
              <div className="flex mr-4 bg-yellow-100 p-1 rounded items-center">
                <button 
                  onClick={handleGrantAdmin}
                  className="text-xs bg-indigo-500 text-white px-2 py-1 rounded mr-2"
                >
                  Grant Admin
                </button>
                <button 
                  onClick={refreshAdminStatus}
                  className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                >
                  Refresh
                </button>
              </div>
            )}
            
            {/* Add admin link only when not on native app */}
            {isAdmin && !isNativeApp && (
              <Link 
                to="/admin" 
                className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 mr-4"
                title={`Admin (${user?.email})`}
              >
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </Link>
            )}
            
            {/* Debug toggle */}
            <button
              onClick={toggleDebug}
              className="mr-4 text-gray-500 hover:text-gray-700"
              title="Debug tools"
            >
              <Bug className="w-4 h-4" />
            </button>
            
            {adminLoading && (
              <span className="text-gray-500 mr-4 text-xs">
                (Checking admin...)
              </span>
            )}
            <span className="text-gray-600 mr-4">
              {user?.name || user?.email || 'User'}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Sign Out
            </button>
          </>
        )}
        
        {!isLoggedIn && !isAuthPage && (
          <>
            <Link
              to="/signin"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 mr-4"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
