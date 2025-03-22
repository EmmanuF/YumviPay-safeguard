
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { clearCountriesCache } from '@/hooks/countries/countriesCache';
import { Info, ChevronUp, ChevronDown, Trash2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCountries } from '@/hooks/useCountries';

const DebugTools: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { countries, refreshCountriesData } = useCountries();
  
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

  const handleRefreshCountriesData = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default action
    e.stopPropagation(); // Stop event propagation
    
    try {
      // Trigger a refresh of the countries data
      refreshCountriesData();
      
      // Show success message
      toast({
        title: "Countries Data Refreshed",
        description: "The countries data is being refreshed with fresh data.",
        variant: "default",
      });
      
      console.log("🔄 Countries data refresh triggered manually via debug tool");
    } catch (error) {
      console.error("Error refreshing countries data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh countries data",
        variant: "destructive",
      });
    }
  };

  // Calculate some useful debug stats
  const sendingCountries = countries.filter(c => c.isSendingEnabled);
  const receivingCountries = countries.filter(c => c.isReceivingEnabled);

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
        <div 
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1" />
            <span className="text-xs">Debug Tools</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </div>
        
        {isExpanded && (
          <div className="px-3 pb-3 text-xs">
            <div className="mb-2">
              <p>Countries: {countries.length}</p>
              <p className={sendingCountries.length === 0 ? "text-red-400" : "text-green-400"}>
                Sending: {sendingCountries.length}
              </p>
              <p>Receiving: {receivingCountries.length}</p>
              
              {sendingCountries.length > 0 && (
                <div className="mt-1">
                  <p>Sending countries:</p>
                  <ul className="text-xs ml-2 mt-1 text-gray-300">
                    {sendingCountries.slice(0, 3).map(c => (
                      <li key={c.code}>{c.name} ({c.currency})</li>
                    ))}
                    {sendingCountries.length > 3 && <li>...and {sendingCountries.length - 3} more</li>}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleClearCache}
                className="text-xs flex items-center w-full"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear Countries Cache
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshCountriesData}
                className="text-xs flex items-center w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh Countries Data
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugTools;
