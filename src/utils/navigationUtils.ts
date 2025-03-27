
/**
 * Navigation utilities to improve reliability of route changes
 */

/**
 * Navigate to a new route with better error handling
 * and support for query parameters
 */
export const navigate = (to: string): void => {
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
      
      history.pushState({}, '', newUrl);
      
      // Dispatch a popstate event for React Router to detect
      const popStateEvent = new PopStateEvent('popstate', { state: {} });
      window.dispatchEvent(popStateEvent);
      
      // Also dispatch a custom event for any other listeners
      const navigationEvent = new CustomEvent('navigation', { 
        detail: { route: to } 
      });
      window.dispatchEvent(navigationEvent);
      
      // Scroll to top for better UX
      window.scrollTo(0, 0);
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
