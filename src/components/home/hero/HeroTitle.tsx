
import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';

interface HeroTitleProps {
  className?: string;
}

const HeroTitle: React.FC<HeroTitleProps> = ({ className = '' }) => {
  const { t } = useLocale();
  
  return (
    <h1 
      className={`text-4xl md:text-5xl font-bold text-center md:text-left leading-tight text-white ${className}`}
    >
      {t('home.transferWithoutBoundaries')}
    </h1>
  );
};

export default HeroTitle;
