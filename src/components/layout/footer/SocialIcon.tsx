
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
    className="bg-indigo-800 hover:bg-primary-600 text-white p-2.5 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md border border-indigo-700"
  >
    {icon}
  </a>
);

export default SocialIcon;
