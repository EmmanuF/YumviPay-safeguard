
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { showErrorToast } from '@/utils/errorHandling';

export const useSendMoneyPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [needsInitialData, setNeedsInitialData] = useState(true);
  
  // Default to Cameroon if user country not available
  const defaultCountryCode = user?.country || 'CM';
  
  // Check authentication status
  useEffect(() => {
    console.log('SendMoney: Checking auth status...', { authLoading, isLoggedIn });
    
    if (!authLoading) {
      console.log('SendMoney: Auth check complete:', { isLoggedIn });
      setAuthChecked(true);
      
      // Debug user state
      console.log('Current user state:', user);
      console.log('Auth state isLoggedIn:', isLoggedIn);
    }
  }, [authLoading, isLoggedIn, user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authChecked && !authLoading) {
      if (!isLoggedIn) {
        console.log('SendMoney: User not logged in, redirecting to signin');
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue with your transaction.",
          variant: "default"
        });
        navigate('/signin', { state: { redirectTo: '/send' } });
      } else {
        console.log('SendMoney: User is logged in, continuing to Send Money page');
      }
      
      // Set pageLoading to false once auth is checked (regardless of result)
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
