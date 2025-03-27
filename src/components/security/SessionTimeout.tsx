import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SessionTimeoutProps {
  timeout?: number; // in milliseconds, default 60 minutes
  warningTime?: number; // in milliseconds, default 2 minutes
}

const SessionTimeout: React.FC<SessionTimeoutProps> = ({ 
  timeout = 2 * 60 * 60 * 1000, // 2 hours (increased from 60 minutes)
  warningTime = 5 * 60 * 1000 // 5 minutes (increased from 2 minutes)
}) => {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { signOut, isLoggedIn, refreshAuthState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Update last activity timestamp when user interacts with the page
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
    
    // Also update the cached auth check timestamp to keep them in sync
    localStorage.setItem('lastAuthCheck', Date.now().toString());
  }, []);
  
  // Log out the user
  const handleTimeout = useCallback(async () => {
    if (!isLoggedIn) {
      setShowWarning(false);
      return;
    }
    
    try {
      await signOut();
      toast({
        title: 'Session Expired',
        description: 'You have been logged out due to inactivity',
        variant: 'default',
      });
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
      
      // Force redirect to signin even if signOut fails
      navigate('/signin');
    }
    
    setShowWarning(false);
  }, [isLoggedIn, signOut, navigate, toast]);
  
  // Continue the session and refresh auth state
  const continueSession = useCallback(async () => {
    updateActivity();
    
    try {
      // Try to refresh the auth state in the background
      await refreshAuthState();
      
      toast({
        title: 'Session Extended',
        description: 'Your session has been extended',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error refreshing auth state:', error);
      
      // Even if refresh fails, allow user to continue using the app
      // as long as they're interacting with it
    }
  }, [updateActivity, refreshAuthState, toast]);
  
  // Set up event listeners for user activity
  useEffect(() => {
    if (!isLoggedIn) return;
    
    // Expanded list of events to detect user activity
    const events = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart',
      'click', 'keydown', 'touchmove', 'focus', 'input', 'change',
      'wheel', 'drag', 'drop', 'submit'
    ];
    
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    // Listen for navigation between pages
    const handleRouteChange = () => {
      console.log('Route changed, updating activity timestamp');
      updateActivity();
    };
    
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('navigation', handleRouteChange);
    
    // Update activity on component mount
    updateActivity();
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('navigation', handleRouteChange);
    };
  }, [isLoggedIn, updateActivity]);
  
  // Check for timeout
  useEffect(() => {
    if (!isLoggedIn) return;
    
    let intervalId: number;
    
    const checkActivity = () => {
      const now = Date.now();
      const elapsed = now - lastActivity;
      
      // Log activity checks less frequently to avoid console spam
      if (elapsed > timeout - warningTime * 2) {
        console.log(`Session check: ${Math.round(elapsed / 1000)}s since last activity`, 
          { warning: showWarning, timeout: Math.round(timeout / 1000), lastActivity: new Date(lastActivity).toISOString() });
      }
      
      if (elapsed >= timeout) {
        // Session timed out
        console.log('Session timeout reached, logging out');
        handleTimeout();
      } else if (elapsed >= timeout - warningTime && !showWarning) {
        // Show warning
        console.log('Showing session timeout warning');
        setShowWarning(true);
        setTimeLeft(Math.ceil((timeout - elapsed) / 1000));
      } else if (showWarning) {
        // Update time left
        setTimeLeft(Math.ceil((timeout - elapsed) / 1000));
      }
    };
    
    // Check every minute when far from timeout, more frequently when close
    intervalId = window.setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      
      if (elapsed > timeout - warningTime - 30000 || showWarning) {
        // Check every second when close to warning or when warning is shown
        clearInterval(intervalId);
        intervalId = window.setInterval(checkActivity, 1000);
      } else {
        checkActivity();
      }
    }, 60000); // Check every minute instead of 10 seconds
    
    return () => clearInterval(intervalId);
  }, [isLoggedIn, lastActivity, timeout, warningTime, showWarning, handleTimeout]);
  
  if (!isLoggedIn || !showWarning) {
    return null;
  }
  
  return (
    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Timeout Warning</AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in {timeLeft} seconds due to inactivity. Would you like to continue using the application?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleTimeout}>Log Out</AlertDialogCancel>
          <AlertDialogAction onClick={continueSession}>Continue Session</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionTimeout;
