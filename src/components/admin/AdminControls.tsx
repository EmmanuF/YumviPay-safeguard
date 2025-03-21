
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Shield, ExternalLink } from 'lucide-react';
import { forceCountryRefresh } from '@/utils/forceCountryRefresh';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AdminControlsProps {
  className?: string;
  disableCountryFeatures?: boolean;
}

const AdminControls: React.FC<AdminControlsProps> = ({ className, disableCountryFeatures = false }) => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshCountries = async () => {
    if (disableCountryFeatures) {
      toast.info('Country features are currently disabled');
      return;
    }
    
    setIsRefreshing(true);
    try {
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
        <CardTitle className="text-base flex justify-between items-center">
          <span>Developer Controls</span>
          {disableCountryFeatures && (
            <span className="text-xs text-orange-500 font-normal">Limited Mode</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`w-full justify-start ${disableCountryFeatures ? 'opacity-50' : ''}`}
          onClick={handleRefreshCountries}
          disabled={isRefreshing || disableCountryFeatures}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing Countries...' : 'Refresh Countries Data'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className={`w-full justify-start ${disableCountryFeatures ? 'opacity-50' : ''}`}
          onClick={() => navigate('/admin/countries-status')}
          disabled={disableCountryFeatures}
        >
          <Database className="h-4 w-4 mr-2" />
          Check Countries Status
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className={`w-full justify-start text-amber-600 ${disableCountryFeatures ? 'opacity-50' : ''}`}
          onClick={() => navigate('/admin/countries')}
          disabled={disableCountryFeatures}
        >
          <Shield className="h-4 w-4 mr-2" />
          Manage Countries
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start text-primary"
          onClick={() => navigate('/admin/dashboard')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Go to Admin Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminControls;
