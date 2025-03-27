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
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/components/ui/use-toast';
import { LAST_AUTH_CHECK_KEY } from '@/services/auth/constants';

interface SessionTimeoutProps {
  timeout?: number; // in milliseconds, default 2 hours
  warningTime?: number; // in milliseconds, default 5 minutes
}

const SessionTimeout: React.FC<SessionTimeoutProps> = ({ 
  timeout = 3 * 60 * 60 * 1000, // 3 hours (increased for better UX)
  warningTime = 10 * 60 * 1000 // 10 minutes (increased for better UX)
}) => {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { signOut, isLoggedIn, refreshAuthState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
    
    localStorage.setItem(LAST_AUTH_CHECK_KEY, Date.now().toString());
  }, []);
  
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
      
      navigate('/signin');
    }
    
    setShowWarning(false);
  }, [isLoggedIn, signOut, navigate, toast]);
  
  const continueSession = useCallback(async () => {
    updateActivity();
    
    try {
      await refreshAuthState();
      
      toast({
        title: 'Session Extended',
        description: 'Your session has been extended',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error refreshing auth state:', error);
    }
  }, [updateActivity, refreshAuthState, toast]);
  
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const events = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart',
      'click', 'keydown', 'touchmove', 'focus', 'input', 'change',
      'wheel', 'drag', 'drop', 'submit'
    ];
    
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    const handleRouteChange = () => {
      console.log('Route changed, updating activity timestamp');
      updateActivity();
    };
    
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('navigation', handleRouteChange);
    
    updateActivity();
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('navigation', handleRouteChange);
    };
  }, [isLoggedIn, updateActivity]);
  
  useEffect(() => {
    if (!isLoggedIn) return;
    
    let intervalId: number;
    
    const checkActivity = () => {
      const now = Date.now();
      const elapsed = now - lastActivity;
      
      if (elapsed > timeout - warningTime * 2) {
        console.log(`Session check: ${Math.round(elapsed / 1000)}s since last activity`, 
          { warning: showWarning, timeout: Math.round(timeout / 1000), lastActivity: new Date(lastActivity).toISOString() });
      }
      
      if (elapsed >= timeout) {
        console.log('Session timeout reached, logging out');
        handleTimeout();
      } else if (elapsed >= timeout - warningTime && !showWarning) {
        console.log('Showing session timeout warning');
        setShowWarning(true);
        setTimeLeft(Math.ceil((timeout - elapsed) / 1000));
      } else if (showWarning) {
        setTimeLeft(Math.ceil((timeout - elapsed) / 1000));
      }
    };
    
    intervalId = window.setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      
      if (elapsed > timeout - warningTime - 30000 || showWarning) {
        clearInterval(intervalId);
        intervalId = window.setInterval(checkActivity, 1000);
      } else {
        checkActivity();
      }
    }, 60000);
    
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
