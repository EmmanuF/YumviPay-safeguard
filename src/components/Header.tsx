
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Shield } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { isPlatform } from '@/utils/platform';

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
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const isNativeApp = isPlatform('native');
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-gray-800">
        Yumvi-Pay
      </Link>
      <nav className="flex items-center">
        {isLoggedIn ? (
          <>
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
        ) : (
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
