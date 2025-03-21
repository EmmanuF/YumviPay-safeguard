
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CountriesManager = () => {
  const navigate = useNavigate();
  
  const handleNavigateToCountries = () => {
    navigate('/admin/countries');
  };
  
  const handleNavigateToStatusCheck = () => {
    navigate('/admin/check-countries-status');
  };
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-lg">
        <CardTitle className="text-lg text-primary-700">Countries Manager</CardTitle>
        <CardDescription>
          Manage sending and receiving countries, payment methods and regional settings
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center py-6 space-y-6">
          <p className="text-muted-foreground">
            Countries management is available in the dedicated Countries section of the admin panel,
            which provides comprehensive tools for managing countries, their payment methods, and regional settings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleNavigateToCountries}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Go to Countries Management <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              onClick={handleNavigateToStatusCheck}
              variant="outline"
              className="border-amber-500 text-amber-600 hover:bg-amber-50"
            >
              <AlertTriangle className="mr-2 h-4 w-4" /> Check & Repair Country Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountriesManager;
