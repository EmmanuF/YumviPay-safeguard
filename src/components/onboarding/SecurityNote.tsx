
import React from 'react';
import { Shield } from 'lucide-react';

const SecurityNote: React.FC = () => {
  return (
    <div className="glass-effect rounded-xl p-4 flex items-start mb-8">
      <Shield className="w-5 h-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-gray-600">
        Your information is securely stored and only used for identity verification 
        and payment processing purposes.
      </p>
    </div>
  );
};

export default SecurityNote;
