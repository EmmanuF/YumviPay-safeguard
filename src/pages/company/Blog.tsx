
import React from 'react';
import WorkInProgress from '@/components/common/WorkInProgress';
import { BookOpenIcon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const Blog = () => {
  return (
    <PageTransition>
      <WorkInProgress 
        title="Blog" 
        description="Our blog featuring insights about money transfers, African economies, and tips for sending money to loved ones is coming soon."
        icon={<BookOpenIcon className="w-12 h-12 text-indigo-600" />}
      />
    </PageTransition>
  );
};

export default Blog;
