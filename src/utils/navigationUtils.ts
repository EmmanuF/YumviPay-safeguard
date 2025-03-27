
import { LAST_AUTH_CHECK_KEY } from '@/services/auth/constants';

/**
 * Navigation utilities to improve reliability of route changes
 */

/**
 * Navigate to a new route with better error handling
 * and support for query parameters
 */
export const navigate = (to: string, preserveAuthState = true): void => {
  try {
    // Check if we have access to the History API
    if (window.history && window.history.pushState) {
      console.log(`🧭 Navigating to: ${to}`);
      
      // Get the current history object
      const history = window.history;
      
      // Update URL and push state
      const newUrl = to.startsWith('/') 
        ? to 
        : `/${to}`;
      
      // If we want to preserve auth state, add it to the state object
      const stateObj = preserveAuthState ? {
        authStatePreserved: true,
        timestamp: Date.now(),
      } : {};
      
      // Always update the auth check timestamp when navigating
      if (preserveAuthState) {
        localStorage.setItem(LAST_AUTH_CHECK_KEY, Date.now().toString());
      }
      
      history.pushState(stateObj, '', newUrl);
      
      // Dispatch a popstate event for React Router to detect
      const popStateEvent = new PopStateEvent('popstate', { state: stateObj });
      window.dispatchEvent(popStateEvent);
      
      // Also dispatch a custom event for any other listeners
      const navigationEvent = new CustomEvent('navigation', { 
        detail: { route: to, preserveAuthState } 
      });
      window.dispatchEvent(navigationEvent);
      
      // Scroll to top for better UX
      window.scrollTo(0, 0);
      
      // Update the last navigation timestamp to help with auth state management
      if (preserveAuthState) {
        localStorage.setItem('lastNavigationTimestamp', Date.now().toString());
      }
    } else {
      // Fallback to traditional navigation
      console.log(`🧭 Navigating to: ${to} (traditional fallback)`);
      window.location.href = to;
    }
  } catch (error) {
    console.error('Navigation error:', error);
    
    // Failsafe fallback
    try {
      window.location.href = to;
    } catch (e) {
      console.error('Critical navigation failure:', e);
    }
  }
};

export default {
  navigate
};
