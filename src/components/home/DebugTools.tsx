
import React from 'react';
import { Button } from '@/components/ui/button';
import { clearCountriesCache } from '@/hooks/countries/countriesCache';
import { Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DebugTools: React.FC = () => {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleClearCache = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default action
    e.stopPropagation(); // Stop event propagation
    
    try {
      // Clear the cache but don't force page reload
      clearCountriesCache();
      
      // Show success message
      toast({
        title: "Cache Cleared",
        description: "Countries cache has been cleared. Please refresh the page to load fresh data.",
        variant: "default",
      });
      
      console.log("🧹 Countries cache cleared manually via debug tool");
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast({
        title: "Error",
        description: "Failed to clear countries cache",
        variant: "destructive",
      });
    }
  };

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
          onClick={handleClearCache}
          className="text-xs"
        >
          Clear Countries Cache
        </Button>
      </div>
    </div>
  );
};

export default DebugTools;
