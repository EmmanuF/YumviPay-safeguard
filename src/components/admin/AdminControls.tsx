
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Shield } from 'lucide-react';
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
      // Show immediate feedback
      toast.loading('Refreshing country data...', { id: 'country-refresh' });
      
      const result = await forceCountryRefresh();
      
      if (result) {
        toast.success('Countries data refreshed successfully', { id: 'country-refresh' });
      } else {
        toast.error('Failed to refresh countries data', { id: 'country-refresh' });
      }
    } catch (error) {
      console.error('Error refreshing countries:', error);
      toast.error(`Failed to refresh: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        { id: 'country-refresh' });
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
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start text-amber-600"
          onClick={() => navigate('/admin/countries')}
        >
          <Shield className="h-4 w-4 mr-2" />
          Manage Countries
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminControls;
