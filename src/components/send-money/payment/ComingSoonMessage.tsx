
import React from 'react';
import { Clock } from 'lucide-react';

interface ComingSoonMessageProps {
  message: string;
}

const ComingSoonMessage: React.FC<ComingSoonMessageProps> = ({ message }) => {
  return (
    <div className="p-4 border border-amber-200 rounded-md bg-amber-50 mt-3">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-amber-500" />
        <p className="text-amber-800 font-medium">Coming Soon</p>
      </div>
      <p className="text-sm text-amber-700 mt-1">
        {message}
      </p>
    </div>
  );
};

export default ComingSoonMessage;
