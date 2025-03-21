
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CountriesManager = () => {
  const navigate = useNavigate();
  
  const handleNavigateToCountries = () => {
    navigate('/admin/countries');
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
        <div className="text-center py-12 space-y-6">
          <p className="text-muted-foreground">
            Countries management is available in the dedicated Countries section of the admin panel,
            which provides comprehensive tools for managing countries, their payment methods, and regional settings.
          </p>
          <Button 
            onClick={handleNavigateToCountries}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Go to Countries Management <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountriesManager;
