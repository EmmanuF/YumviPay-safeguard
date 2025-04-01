
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth'; 
import { useToast } from '@/components/ui/use-toast';

export const useSendMoneyPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [needsInitialData, setNeedsInitialData] = useState(true);
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const { toast } = useToast();
  
  // Default to Cameroon if user country not available
  const defaultCountryCode = user?.country || 'CM';
  
  // Check authentication status with a proper effect
  useEffect(() => {
    console.log('SendMoney: Auth status check effect running', { authLoading, isLoggedIn });
    
    // Only proceed when auth loading is complete
    if (!authLoading) {
      console.log('SendMoney: Auth check complete:', { isLoggedIn });
      setAuthChecked(true);
    }
  }, [authLoading, isLoggedIn]);

  // Handle redirect logic in a separate effect to avoid conditional hooks
  useEffect(() => {
    if (authChecked && !authLoading && !isLoggedIn && !redirectInProgress) {
      console.log('SendMoney: User not logged in, redirecting to signin');
      setRedirectInProgress(true);
      
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with your transaction.",
        variant: "default"
      });
      
      navigate('/signin', { state: { redirectTo: '/send' } });
    }
    
    // Set pageLoading to false once auth is checked
    if (authChecked) {
      console.log('SendMoney: Auth check finished, setting pageLoading to false');
      setPageLoading(false);
    }
  }, [authChecked, isLoggedIn, authLoading, navigate, toast, redirectInProgress]);

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
