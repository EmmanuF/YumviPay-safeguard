
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import MobileAppLayout from '@/components/MobileAppLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MobileAppLayout>
      <Helmet>
        <title>Page Not Found | Yumvi-Pay</title>
      </Helmet>
      
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center py-10 max-w-md">
          <div className="bg-primary-50 text-primary-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl font-bold">404</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops! Page not found</h1>
          
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2">
              <Link to="/">
                <Home size={18} />
                Return to Home
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="border-primary-600 text-primary-600 flex items-center gap-2"
              onClick={() => window.history.back()}
            >
              <button>
                <ArrowLeft size={18} />
                Go Back
              </button>
            </Button>
          </div>
        </div>
      </div>
    </MobileAppLayout>
  );
};

export default NotFound;
