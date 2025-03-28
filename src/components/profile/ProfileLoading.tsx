
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const ProfileLoading: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <motion.div 
        className="flex flex-col items-center space-y-4 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-36" />
      </motion.div>
      
      <Card className="p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </Card>
      
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
};

export default ProfileLoading;
