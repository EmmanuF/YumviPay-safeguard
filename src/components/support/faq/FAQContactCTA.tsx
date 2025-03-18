
import React from 'react';
import { Button } from '@/components/ui/button';

const FAQContactCTA: React.FC = () => {
  return (
    <div className="text-center mt-8 p-6 bg-primary-50 rounded-xl">
      <h3 className="font-semibold text-primary-700 mb-2">Still have questions?</h3>
      <p className="text-gray-600 mb-4">
        Contact our support team for personalized assistance with any issues or questions you might have.
      </p>
      <Button onClick={() => window.location.href = '/contact'}>
        Contact Support
      </Button>
    </div>
  );
};

export default FAQContactCTA;
