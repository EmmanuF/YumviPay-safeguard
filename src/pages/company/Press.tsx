
import React from 'react';
import WorkInProgress from '@/components/common/WorkInProgress';
import { NewspaperIcon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const Press = () => {
  return (
    <PageTransition>
      <WorkInProgress 
        title="Press & Media" 
        description="Find the latest news, press releases, and media resources about Yumvi-Pay. Our press page is currently under development."
        icon={<NewspaperIcon className="w-12 h-12 text-indigo-600" />}
      />
    </PageTransition>
  );
};

export default Press;
