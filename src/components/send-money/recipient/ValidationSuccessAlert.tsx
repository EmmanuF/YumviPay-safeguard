
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from '@/hooks/use-mobile';

export const ValidationSuccessAlert: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-6 ${isMobile ? 'px-4' : ''}`}
    >
      <Alert className="bg-green-50 border-green-200 text-green-800 relative overflow-hidden rounded-xl">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400/30 via-green-500 to-green-400/30"></div>
        
        <AlertDescription className="flex items-center py-3">
          <Check className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
          <span>All information looks good! You can proceed to the next step.</span>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};
