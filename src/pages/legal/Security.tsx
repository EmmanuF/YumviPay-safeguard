
import React from 'react';
import WorkInProgress from '@/components/common/WorkInProgress';
import { ShieldIcon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const Security = () => {
  return (
    <PageTransition>
      <WorkInProgress 
        title="Security" 
        description="Learn about how we keep your money and personal information secure. Our comprehensive security documentation is being prepared."
        icon={<ShieldIcon className="w-12 h-12 text-indigo-600" />}
      />
    </PageTransition>
  );
};

export default Security;
