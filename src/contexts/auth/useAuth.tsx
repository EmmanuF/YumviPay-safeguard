
import { useContext } from 'react';
import AuthContext from './AuthContext';
import { AuthContextType } from './types';

/**
 * Custom hook for accessing the authentication context.
 * This is the ONLY hook that should be used to access auth state.
 */
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;
