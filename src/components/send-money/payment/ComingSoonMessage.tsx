
import React from 'react';
import { Clock } from 'lucide-react';

interface ComingSoonMessageProps {
  message: string;
}

const ComingSoonMessage: React.FC<ComingSoonMessageProps> = ({ message }) => {
  return (
    <div className="p-4 border border-amber-200 rounded-md bg-amber-50 mt-3 relative overflow-hidden">
      {/* Decorative accent line at the top */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400/30 via-amber-500 to-amber-400/30"></div>
      
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-amber-500" />
        <p className="text-amber-800 font-medium">Coming Soon</p>
      </div>
      <p className="text-sm text-amber-700 mt-1 pl-7">
        {message}
      </p>
    </div>
  );
};

export default ComingSoonMessage;
