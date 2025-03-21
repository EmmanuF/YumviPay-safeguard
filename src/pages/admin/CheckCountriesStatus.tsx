
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { ensureCountryFlags } from '@/utils/repairCountryDatabase';

type CountryStatus = {
  code: string;
  name: string;
  is_sending_enabled: boolean;
  is_receiving_enabled: boolean;
};

const CheckCountriesStatus = () => {
  const [countries, setCountries] = useState<CountryStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('countries')
        .select('code, name, is_sending_enabled, is_receiving_enabled')
        .order('name');
        
      if (error) throw error;
      
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to load countries');
    } finally {
      setLoading(false);
    }
  };

  const repairCountryFlags = async () => {
    try {
      setRefreshing(true);
      
      // Use our new comprehensive repair function
      await ensureCountryFlags();
      
      // Refresh the country list
      await fetchCountries();
    } catch (error) {
      console.error('Error repairing country flags:', error);
      toast.error('Failed to repair country flags');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const sendingCountries = countries.filter(c => c.is_sending_enabled);
  const receivingCountries = countries.filter(c => c.is_receiving_enabled);

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Countries Status Check</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fetchCountries()}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
            <Button 
              onClick={repairCountryFlags}
              disabled={refreshing}
            >
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wrench className="h-4 w-4 mr-2" />}
              Repair Country Flags
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Sending Countries</span>
                <Badge variant="outline">{sendingCountries.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : sendingCountries.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No sending countries found</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sendingCountries.map(country => (
                    <Badge key={country.code} variant="secondary">
                      {country.name} ({country.code})
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Receiving Countries</span>
                <Badge variant="outline">{receivingCountries.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : receivingCountries.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No receiving countries found</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {receivingCountries.map(country => (
                    <Badge key={country.code} variant="secondary">
                      {country.name} ({country.code})
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CheckCountriesStatus;
