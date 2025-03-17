
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FooterSection: React.FC<FooterSectionProps> = ({ 
  title, 
  children, 
  className 
}) => {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  
  // Only make sections expandable on mobile
  if (isMobile) {
    return (
      <div className={cn("mb-6", className)}>
        <button 
          className="flex items-center justify-between w-full text-left mb-2"
          onClick={() => setExpanded(!expanded)}
        >
          <h3 className="text-sm font-semibold text-primary-800">{title}</h3>
          <ArrowRight 
            className={cn(
              "h-4 w-4 text-primary-500 transition-transform", 
              expanded ? "rotate-90" : ""
            )} 
          />
        </button>
        <div className={cn(
          "space-y-2.5 overflow-hidden transition-all", 
          expanded ? "max-h-96" : "max-h-0"
        )}>
          {children}
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("mb-6", className)}>
      <h3 className="text-sm font-semibold text-primary-800 mb-4">{title}</h3>
      <div className="space-y-2.5">
        {children}
      </div>
    </div>
  );
};

export default FooterSection;
