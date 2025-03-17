
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
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
          className="flex items-center justify-between w-full text-left mb-3"
          onClick={() => setExpanded(!expanded)}
        >
          <h3 className="text-base font-semibold text-primary-800">{title}</h3>
          <ChevronRight 
            className={cn(
              "h-4 w-4 text-primary-500 transition-transform", 
              expanded ? "rotate-90" : ""
            )} 
          />
        </button>
        <div className={cn(
          "flex flex-col space-y-2 overflow-hidden transition-all", 
          expanded ? "max-h-96" : "max-h-0"
        )}>
          {children}
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("mb-6", className)}>
      <h3 className="text-base font-semibold text-primary-800 mb-3">{title}</h3>
      <div className="flex flex-col space-y-2">
        {children}
      </div>
    </div>
  );
};

export default FooterSection;
