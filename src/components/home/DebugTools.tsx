
import React from 'react';
import { Button } from '@/components/ui/button';
import { forceRefreshCountriesCache } from '@/hooks/countries/countriesCache';
import { Info } from 'lucide-react';

const DebugTools: React.FC = () => {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-3 text-xs">
        <div className="flex items-center mb-2">
          <Info className="h-4 w-4 mr-1" />
          <span>Debug Tools</span>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => forceRefreshCountriesCache()}
          className="text-xs"
        >
          Clear Countries Cache
        </Button>
      </div>
    </div>
  );
};

export default DebugTools;
