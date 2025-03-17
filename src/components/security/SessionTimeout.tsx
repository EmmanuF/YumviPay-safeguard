
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
  timeout?: number; // in milliseconds, default 15 minutes
  warningTime?: number; // in milliseconds, default 1 minute
}

const SessionTimeout: React.FC<SessionTimeoutProps> = ({ 
  timeout = 15 * 60 * 1000, // 15 minutes
  warningTime = 60 * 1000 // 1 minute
}) => {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const { signOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Update last activity timestamp when user interacts with the page
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);
  
  // Log out the user
  const handleTimeout = useCallback(async () => {
    if (isLoggedIn) {
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
      }
    }
    setShowWarning(false);
  }, [isLoggedIn, signOut, navigate, toast]);
  
  // Set up event listeners for user activity
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [isLoggedIn, updateActivity]);
  
  // Check for timeout
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivity;
      
      if (elapsed >= timeout) {
        // Session timed out
        handleTimeout();
      } else if (elapsed >= timeout - warningTime && !showWarning) {
        // Show warning
        setShowWarning(true);
        setTimeLeft(Math.ceil((timeout - elapsed) / 1000));
      } else if (showWarning) {
        // Update time left
        setTimeLeft(Math.ceil((timeout - elapsed) / 1000));
      }
    }, 1000);
    
    return () => clearInterval(interval);
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
            Your session will expire in {timeLeft} seconds due to inactivity. Do you want to continue using the application?
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
