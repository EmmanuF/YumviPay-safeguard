
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroContent } from './hero';
import HeroBackground from './hero/HeroBackground';

interface HeroProps {
  onGetStarted?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted(); // Use the provided callback if available
    } else {
      navigate('/onboarding'); // Direct navigation otherwise
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-10 overflow-hidden">
      {/* Premium background effect */}
      <HeroBackground />
      
      <div className="flex flex-col items-center relative z-10">
        {/* Hero content */}
        <HeroContent onGetStarted={handleGetStarted} />
      </div>
    </div>
  );
};

export default Hero;
