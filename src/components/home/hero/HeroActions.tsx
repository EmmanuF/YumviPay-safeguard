
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

interface HeroActionsProps {
  onGetStarted: () => void;
}

const HeroActions: React.FC<HeroActionsProps> = ({ onGetStarted }) => {
  const { t } = useLocale();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start">
      <Button 
        size="lg" 
        className="bg-primary hover:bg-primary-600 text-white py-6 px-8" 
        onClick={onGetStarted}
      >
        <span className="mr-2">{t('home.getStarted')}</span>
        <ArrowRight className="h-5 w-5" />
      </Button>
      
      <Button
        variant="secondary"
        size="lg"
        className="bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 text-white py-6 px-8"
      >
        <span className="mr-2">{t('home.downloadApp')}</span>
        <Download className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default HeroActions;
