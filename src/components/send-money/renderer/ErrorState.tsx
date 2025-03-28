
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onBack }) => {
  return (
    <div className="p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      <div className="mt-4 flex justify-center">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 rounded-md text-gray-800"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
