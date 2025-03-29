
import React from 'react';
import { Button } from '@/components/ui/button';

const FAQHelpSection: React.FC = () => {
  return (
    <div className="mt-16 bg-primary-50 rounded-lg p-8 text-center max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-3">Still Need Help?</h2>
      <p className="mb-6 text-gray-700">
        Can't find what you're looking for? Our support team is ready to assist you.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="default" onClick={() => window.location.href = '/contact'}>
          Contact Support
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/support'}>
          View Support Options
        </Button>
      </div>
    </div>
  );
};

export default FAQHelpSection;
