
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database } from 'lucide-react';
import { forceCountryRefresh } from '@/utils/forceCountryRefresh';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AdminControlsProps {
  className?: string;
}

const AdminControls: React.FC<AdminControlsProps> = ({ className }) => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshCountries = async () => {
    setIsRefreshing(true);
    try {
      console.log('Starting country refresh...');
      const result = await forceCountryRefresh();
      
      if (result) {
        toast.success('Countries data refreshed successfully');
      } else {
        toast.error('Failed to refresh countries data');
      }
    } catch (error) {
      console.error('Error refreshing countries:', error);
      toast.error(`Failed to refresh countries: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Developer Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={handleRefreshCountries}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing Countries...' : 'Refresh Countries Data'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={() => navigate('/admin/countries-status')}
        >
          <Database className="h-4 w-4 mr-2" />
          Check Countries Status
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminControls;
