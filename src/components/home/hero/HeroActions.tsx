
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroActionsProps {
  onGetStarted: () => void;
}

const HeroActions: React.FC<HeroActionsProps> = ({ onGetStarted }) => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-wrap gap-3 ${isMobile ? 'justify-center' : ''}`}
    >
      <Button
        onClick={onGetStarted}
        className="bg-primary hover:bg-primary-700 text-white px-5 py-2 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 mobile-touch-target"
        size="sm"
      >
        <motion.span
          className="flex items-center"
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {t('hero.getStarted')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </motion.span>
      </Button>
      
      <Button
        variant="secondary"
        className="border-secondary-200 bg-secondary text-white hover:bg-secondary-400 hover:shadow-lg shadow-secondary/20 font-semibold mobile-touch-target"
        size="sm"
      >
        <motion.span
          className="flex items-center"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Download className="mr-2 h-4 w-4" />
          {t('hero.downloadApp')}
        </motion.span>
      </Button>
    </motion.div>
  );
};

export default HeroActions;
