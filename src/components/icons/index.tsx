
import React from 'react';
import { LucideProps } from 'lucide-react';

export const AppleIcon: React.FC<LucideProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" 
      width="24"
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
  );
};

export const AndroidIcon: React.FC<LucideProps> = (props) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 16V8c0-1 1-2 2-2h10c1 0 2 1 2 2v8c0 1-1 2-2 2H7c-1 0-2-1-2-2Z" />
      <path d="M12 16v3" />
      <path d="M8 3v1" />
      <path d="M16 3v1" />
      <path d="M12 7v2" />
      <path d="M15.6 10a1 1 0 1 1 0-2" />
      <path d="M8.4 10a1 1 0 1 1 0-2" />
      <path d="M7 19h10" />
    </svg>
  );
};
