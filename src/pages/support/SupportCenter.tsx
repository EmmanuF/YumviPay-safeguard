
import React from 'react';
import WorkInProgress from '@/components/common/WorkInProgress';
import { HelpCircleIcon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const SupportCenter = () => {
  return (
    <PageTransition>
      <WorkInProgress 
        title="Support Center" 
        description="Our comprehensive support center with guides, tutorials, and answers to common questions is being built. Please check back soon."
        icon={<HelpCircleIcon className="w-12 h-12 text-indigo-600" />}
      />
    </PageTransition>
  );
};

export default SupportCenter;
