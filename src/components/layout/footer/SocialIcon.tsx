
import React from 'react';

interface SocialIconProps { 
  icon: React.ReactNode; 
  href: string; 
  label: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon, href, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    aria-label={label}
    className="bg-primary-100 hover:bg-primary-200 text-primary-700 p-2.5 rounded-full transition-colors"
  >
    {icon}
  </a>
);

export default SocialIcon;
