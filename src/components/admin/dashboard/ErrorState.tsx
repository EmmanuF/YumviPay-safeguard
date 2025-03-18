
import React from 'react';

interface ErrorStateProps {
  error: unknown;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      <p>Error loading dashboard data. Please try again later.</p>
      <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
  );
};

export default ErrorState;
