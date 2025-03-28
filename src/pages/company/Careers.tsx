
import React from 'react';
import WorkInProgress from '@/components/common/WorkInProgress';
import { BriefcaseIcon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const Careers = () => {
  return (
    <PageTransition>
      <WorkInProgress 
        title="Careers" 
        description="Join our team! We're building a platform that makes international money transfers easy and accessible. Check back soon for open positions."
        icon={<BriefcaseIcon className="w-12 h-12 text-indigo-600" />}
      />
    </PageTransition>
  );
};

export default Careers;
