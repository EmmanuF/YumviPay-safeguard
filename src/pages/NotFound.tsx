
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import MobileAppLayout from '@/components/MobileAppLayout';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

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
      
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4 py-10">
          <h1 className="text-5xl font-bold text-primary-600 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </MobileAppLayout>
  );
};

export default NotFound;
