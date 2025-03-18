
import { useContext } from 'react';
import { NetworkContext } from './NetworkContext';
import { NetworkContextType } from './types';

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

export default useNetwork;
