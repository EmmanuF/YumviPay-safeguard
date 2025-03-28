
import React from 'react';
import WorkInProgress from '@/components/common/WorkInProgress';
import { CookieIcon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const CookiesPolicy = () => {
  return (
    <PageTransition>
      <WorkInProgress 
        title="Cookies Policy" 
        description="Information about how we use cookies and similar technologies on our website is being prepared and will be available soon."
        icon={<CookieIcon className="w-12 h-12 text-indigo-600" />}
      />
    </PageTransition>
  );
};

export default CookiesPolicy;
