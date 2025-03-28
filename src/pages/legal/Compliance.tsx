
import React from 'react';
import WorkInProgress from '@/components/common/WorkInProgress';
import { CheckCircleIcon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const Compliance = () => {
  return (
    <PageTransition>
      <WorkInProgress 
        title="Compliance" 
        description="Information about our regulatory compliance, anti-money laundering policies, and financial licensing will be available here soon."
        icon={<CheckCircleIcon className="w-12 h-12 text-indigo-600" />}
      />
    </PageTransition>
  );
};

export default Compliance;
