import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface PublicRouteProps {
  children: ReactNode;
  redirectLoggedInTo?: string;
}

/**
 * PublicRoute component restricts authenticated users from accessing public pages
 * like sign in or sign up by redirecting them to a specified route (e.g. dashboard)
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectLoggedInTo = '/dashboard' 
}) => {
  const { isLoggedIn, loading } = useAuth();

  // While auth is loading, just render nothing or a loading indicator
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>;
  }
  
  // If user is logged in, redirect to dashboard or specified route
  if (isLoggedIn) {
    return <Navigate to={redirectLoggedInTo} replace />;
  }

  // Otherwise, render the children (public page content)
  return <>{children}</>;
};

export default PublicRoute;
