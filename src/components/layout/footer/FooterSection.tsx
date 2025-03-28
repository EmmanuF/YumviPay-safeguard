
import React from 'react';

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default FooterSection;
