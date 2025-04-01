
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth'; 
import { useToast } from '@/components/ui/use-toast';

export const useSendMoneyPage = () => {
  // Initialize all hooks at the top level
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const { toast } = useToast();
  
  // Initialize all state variables
  const [authChecked, setAuthChecked] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [needsInitialData, setNeedsInitialData] = useState(true);
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  
  // Use a ref to track cleanup state for async operations
  const isMountedRef = useRef(true);
  
  // Default to Cameroon if user country not available
  const defaultCountryCode = user?.country || 'CM';
  
  // Check authentication status with a proper effect
  useEffect(() => {
    console.log('SendMoney: Auth status check effect running', { authLoading, isLoggedIn });
    
    // Set isMounted for the cleanup function
    isMountedRef.current = true;
    
    // Only proceed when auth loading is complete
    if (!authLoading) {
      console.log('SendMoney: Auth check complete:', { isLoggedIn });
      if (isMountedRef.current) {
        setAuthChecked(true);
      }
    }
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [authLoading, isLoggedIn]);

  // Handle redirect logic in a separate effect to avoid conditional hooks
  useEffect(() => {
    if (authChecked && !authLoading && !isLoggedIn && !redirectInProgress && isMountedRef.current) {
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
    if (authChecked && isMountedRef.current) {
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
