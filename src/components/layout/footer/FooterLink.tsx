
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface FooterLinkProps {
  to: string;
  external?: boolean;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ 
  to, 
  external = false, 
  children 
}) => {
  if (external) {
    return (
      <a 
        href={to} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-sm text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1 py-1.5"
      >
        {children}
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  }
  
  return (
    <Link 
      to={to} 
      className="text-sm text-gray-600 hover:text-primary-600 transition-colors inline-block py-1.5"
    >
      {children}
    </Link>
  );
};

export default FooterLink;
