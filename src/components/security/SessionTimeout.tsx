
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
  timeout?: number; // in milliseconds, default 4 hours
  warningTime?: number; // in milliseconds, default 5 minutes
}

const SessionTimeout: React.FC<SessionTimeoutProps> = ({ 
  timeout = 4 * 60 * 60 * 1000, // 4 hours (increased from 60 minutes)
  warningTime = 5 * 60 * 1000 // 5 minutes (increased from 2 minutes)
}) => {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { signOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Update last activity timestamp when user interacts with the page
  const updateActivity = useCallback(() => {
    console.log('User activity detected, updating timestamp');
    setLastActivity(Date.now());
    setShowWarning(false);
    
    // Also update local storage to persist activity state across page refreshes
    localStorage.setItem('lastUserActivity', Date.now().toString());
  }, []);
  
  // Log out the user
  const handleTimeout = useCallback(async () => {
    if (isLoggedIn) {
      try {
        console.log('Session timeout reached, logging out user');
        await signOut();
        toast({
          title: 'Session Expired',
          description: 'You have been logged out due to inactivity',
          variant: 'default',
        });
        navigate('/signin');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
    setShowWarning(false);
  }, [isLoggedIn, signOut, navigate, toast]);
  
  // Set up event listeners for user activity
  useEffect(() => {
    if (!isLoggedIn) return;
    
    console.log('Setting up session timeout monitoring with timeout:', timeout/60000, 'minutes');
    
    // Very comprehensive list of events to detect user activity
    const events = [
      'mousedown', 'mousemove', 'mouseup', 'keypress', 'scroll', 'touchstart',
      'click', 'keydown', 'keyup', 'touchmove', 'focus', 'blur', 'input', 'change',
      'wheel', 'drag', 'dragstart', 'dragend', 'drop', 'submit', 'contextmenu',
      'pointerdown', 'pointermove', 'pointerup', 'resize', 'visibilitychange',
      'select', 'selectstart', 'selectionchange'
    ];
    
    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });
    
    // Additionally update activity when user navigates between pages
    const handleRouteChange = () => {
      console.log('Route changed, updating activity timestamp');
      updateActivity();
    };
    
    // Listen for popstate event (browser back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    // Listen for clicks on anchors - these might cause navigation
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        handleRouteChange();
      }
    });
    
    // Check for stored activity timestamp
    const storedActivity = localStorage.getItem('lastUserActivity');
    if (storedActivity) {
      const storedTime = parseInt(storedActivity);
      if (!isNaN(storedTime) && storedTime > lastActivity) {
        setLastActivity(storedTime);
      }
    }
    
    // Update activity on component mount
    updateActivity();
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      window.removeEventListener('popstate', handleRouteChange);
      document.removeEventListener('click', handleRouteChange);
    };
  }, [isLoggedIn, updateActivity, timeout]);
  
  // Check for timeout
  useEffect(() => {
    if (!isLoggedIn) return;
    
    let intervalId: number;
    
    const checkActivity = () => {
      const now = Date.now();
      const elapsed = now - lastActivity;
      
      // Log activity checks with less frequency to avoid console spam
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
    
    // Check every 30 seconds when far from timeout, more frequently when close
    intervalId = window.setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      
      if (elapsed > timeout - warningTime - 60000 || showWarning) {
        // Check every second when close to warning or when warning is shown
        clearInterval(intervalId);
        intervalId = window.setInterval(checkActivity, 1000);
      } else {
        checkActivity();
      }
    }, 30000); // Reduced frequency to save resources
    
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
            Your session will expire in {Math.floor(timeLeft / 60)} minutes and {timeLeft % 60} seconds due to inactivity. Would you like to continue using the application?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleTimeout}>Log Out</AlertDialogCancel>
          <AlertDialogAction onClick={updateActivity}>Continue Session</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionTimeout;
