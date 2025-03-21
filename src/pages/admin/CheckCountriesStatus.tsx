
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { ensureCountryFlags } from '@/utils/repairCountryDatabase';
import { SENDING_COUNTRIES, AFRICAN_COUNTRY_CODES } from '@/utils/countryRules';

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
      
      // Log country status for debugging
      console.log('✓ Countries fetched:', data?.length || 0);
      
      // Check if sending countries are properly configured
      const sendingCount = (data || []).filter(c => c.is_sending_enabled).length;
      console.log(`✓ Found ${sendingCount} sending countries in database`);
      
      // Check for specific sending countries
      const expectedSendingCodes = ['US', 'CA', 'GB', 'FR'];
      expectedSendingCodes.forEach(code => {
        const country = (data || []).find(c => c.code === code);
        if (country) {
          console.log(`✓ ${country.name} (${country.code}): sending=${country.is_sending_enabled}, receiving=${country.is_receiving_enabled}`);
          if (!country.is_sending_enabled) {
            console.warn(`⚠️ Expected sending country ${country.name} (${country.code}) is not set as sending`);
          }
        } else {
          console.warn(`⚠️ Expected sending country with code ${code} not found in database`);
        }
      });
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
      
      // Use our comprehensive repair function
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

  // Check if expected sending countries are configured correctly
  const sendingCountryIssues = SENDING_COUNTRIES.filter(code => 
    !sendingCountries.some(c => c.code === code)
  );

  // Check if African countries are correctly set as non-sending
  const africanCountryIssues = countries.filter(c => 
    AFRICAN_COUNTRY_CODES.includes(c.code) && c.is_sending_enabled
  );

  const hasCountryIssues = sendingCountryIssues.length > 0 || africanCountryIssues.length > 0;

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
              variant={hasCountryIssues ? "destructive" : "default"}
            >
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wrench className="h-4 w-4 mr-2" />}
              Repair Country Flags
              {hasCountryIssues && " (Issues Detected)"}
            </Button>
          </div>
        </div>

        {hasCountryIssues && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="text-amber-800">
                <h3 className="font-medium mb-2">Country Configuration Issues Detected:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {sendingCountryIssues.length > 0 && (
                    <li>
                      {sendingCountryIssues.length} sending countries not properly configured: 
                      <span className="font-mono ml-1">
                        {sendingCountryIssues.join(', ')}
                      </span>
                    </li>
                  )}
                  {africanCountryIssues.length > 0 && (
                    <li>
                      {africanCountryIssues.length} African countries incorrectly set as sending: 
                      <span className="font-mono ml-1">
                        {africanCountryIssues.map(c => c.code).join(', ')}
                      </span>
                    </li>
                  )}
                </ul>
                <p className="mt-2 text-sm">
                  Click the "Repair Country Flags" button to automatically fix these issues.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

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
