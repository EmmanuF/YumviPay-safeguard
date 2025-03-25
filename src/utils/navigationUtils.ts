
/**
 * Simple navigation utility that uses window.location directly
 * This avoids react-router-dom issues when navigating during redirects
 */

/**
 * Navigate to a new URL directly
 * @param path The path to navigate to
 * @param options Navigation options
 */
export const navigate = (
  path: string, 
  options?: { 
    replace?: boolean, 
    state?: Record<string, any>
  }
): void => {
  try {
    // Handle state by storing it in sessionStorage temporarily
    if (options?.state) {
      const stateKey = `nav_state_${Date.now()}`;
      sessionStorage.setItem(stateKey, JSON.stringify(options.state));
      
      // Add state key as query parameter
      const hasQuery = path.includes('?');
      path = `${path}${hasQuery ? '&' : '?'}stateKey=${stateKey}`;
    }
    
    // Use the appropriate method based on replace option
    if (options?.replace) {
      window.location.replace(path);
    } else {
      window.location.href = path;
    }
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to simpler navigation without state
    window.location.href = path;
  }
};

/**
 * Get state passed from direct navigation
 * @returns The state object or null if none exists
 */
export const getNavigationState = (): Record<string, any> | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const stateKey = urlParams.get('stateKey');
    
    if (stateKey) {
      const stateJson = sessionStorage.getItem(stateKey);
      if (stateJson) {
        // Clean up after retrieving
        sessionStorage.removeItem(stateKey);
        return JSON.parse(stateJson);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving navigation state:', error);
    return null;
  }
};

/**
 * Get URL parameters as an object
 */
export const getUrlParams = (): Record<string, string> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
};
