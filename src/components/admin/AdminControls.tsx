
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database } from 'lucide-react';
import { forceCountryRefresh } from '@/utils/forceCountryRefresh';
import { useNavigate } from 'react-router-dom';

interface AdminControlsProps {
  className?: string;
}

const AdminControls: React.FC<AdminControlsProps> = ({ className }) => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshCountries = async () => {
    setIsRefreshing(true);
    try {
      await forceCountryRefresh();
    } catch (error) {
      console.error('Error refreshing countries:', error);
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
          <RefreshCw className="h-4 w-4 mr-2" />
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
