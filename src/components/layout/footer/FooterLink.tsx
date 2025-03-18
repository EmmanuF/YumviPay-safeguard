
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface FooterLinkProps {
  to: string;
  external?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ 
  to, 
  external = false,
  disabled = false,
  children 
}) => {
  // If link is disabled, render as a span with disabled styling
  if (disabled) {
    return (
      <span className="text-sm text-gray-400 cursor-not-allowed py-1.5 block opacity-70">
        {children}
        <span className="text-xs ml-1.5 bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">
          Coming Soon
        </span>
      </span>
    );
  }
  
  // External link rendering
  if (external) {
    return (
      <a 
        href={to} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-sm text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1 py-1.5 block"
      >
        {children}
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  }
  
  // Internal link using React Router's Link
  return (
    <Link 
      to={to} 
      className="text-sm text-gray-600 hover:text-primary-600 transition-colors block py-1.5"
    >
      {children}
    </Link>
  );
};

export default FooterLink;
