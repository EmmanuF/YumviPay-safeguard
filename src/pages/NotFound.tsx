
import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MobileAppLayout from '@/components/MobileAppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Log the attempted access to non-existent route
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <MobileAppLayout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center px-4 py-10 max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
            <p className="text-2xl font-semibold text-gray-700 mb-4">Oops! Page not found</p>
            <p className="text-gray-500 mb-8">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={goBack}
              variant="outline" 
              className="btn-secondary-visible flex items-center justify-center"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
            
            <Button 
              asChild
              className="btn-primary-visible flex items-center justify-center"
              size="lg"
            >
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MobileAppLayout>
  );
};

export default NotFound;
