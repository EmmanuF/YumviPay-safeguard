
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth'; // Fixed import path
import { useToast } from '@/components/ui/use-toast';
import { showErrorToast } from '@/utils/errorHandling';

export const useSendMoneyPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [needsInitialData, setNeedsInitialData] = useState(true);
  
  // Default to Cameroon if user country not available
  const defaultCountryCode = user?.country || 'CM';
  
  // Check authentication status - use useCallback to prevent infinite loops
  const checkAuthStatus = useCallback(() => {
    console.log('SendMoney: Checking auth status...', { authLoading, isLoggedIn });
    
    // Don't use setTimeout to avoid potential race conditions
    if (!authLoading) {
      console.log('SendMoney: Auth check complete:', { isLoggedIn });
      setAuthChecked(true);
    }
  }, [authLoading, isLoggedIn]);
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authChecked && !authLoading && !isLoggedIn) {
      console.log('SendMoney: User not logged in, redirecting to signin');
      useToast().toast({
        title: "Authentication Required",
        description: "Please sign in to continue with your transaction.",
        variant: "default"
      });
      navigate('/signin', { state: { redirectTo: '/send' } });
    }
    
    // Set pageLoading to false once auth is checked (regardless of result)
    if (authChecked) {
      console.log('SendMoney: Auth check finished, setting pageLoading to false');
      setPageLoading(false);
    }
  }, [authChecked, isLoggedIn, authLoading, navigate]);

  return {
    isLoggedIn,
    authLoading,
    authChecked,
    pageLoading,
    setPageLoading,
    needsInitialData,
    setNeedsInitialData,
    defaultCountryCode,
  };
};
