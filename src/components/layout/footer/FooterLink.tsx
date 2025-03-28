
import React from 'react';
import { Link } from 'react-router-dom';

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => {
  return (
    <Link 
      to={to}
      className="text-gray-300 hover:text-white transition-colors text-sm relative group"
    >
      <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
        {children}
      </span>
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary-300 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
};

export default FooterLink;
