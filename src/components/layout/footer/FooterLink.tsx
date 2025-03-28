
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterLinkProps {
  to: string;
  external?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ 
  to, 
  external = false,
  disabled = false,
  children,
  className
}) => {
  if (disabled) {
    return (
      <span className={cn(
        "text-sm text-gray-400 cursor-not-allowed block py-1.5",
        className
      )}>
        {children}
      </span>
    );
  }

  if (external) {
    return (
      <a 
        href={to} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={cn(
          "text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1 py-1.5 block",
          className
        )}
      >
        {children}
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  }
  
  return (
    <Link 
      to={to} 
      className={cn(
        "text-sm text-gray-300 hover:text-white transition-colors block py-1.5",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default FooterLink;
