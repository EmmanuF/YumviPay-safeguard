
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface RecipientStepNavigationProps {
  onNext: () => void;
  onBack: () => void;
  isNextDisabled: boolean;
}

const RecipientStepNavigation: React.FC<RecipientStepNavigationProps> = ({
  onNext,
  onBack,
  isNextDisabled
}) => {
  const isMobile = useIsMobile();
  
  const containerClass = isMobile 
    ? "fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-100 py-4 px-4 shadow-lg z-50" 
    : "w-full mt-8";
    
  const buttonClass = isMobile
    ? "w-full"
    : "flex-1";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={containerClass}
    >
      <div className="flex gap-4 max-w-3xl mx-auto">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack} 
          className={`${buttonClass} h-14 border-primary-200 hover:border-primary-300 text-base group btn-hover-effect`}
          size="lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>
        <Button 
          type="button"
          onClick={onNext} 
          className={`${buttonClass} h-14 bg-gradient-to-br from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-base group btn-hover-effect`}
          size="lg"
          disabled={isNextDisabled}
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
};

export default RecipientStepNavigation;
