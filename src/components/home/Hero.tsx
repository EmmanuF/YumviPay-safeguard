
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroContent } from './hero';
import { HeroCalculator } from './hero';

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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="flex flex-col items-center">
        {/* Hero content */}
        <HeroContent onGetStarted={handleGetStarted} />
        
        {/* Calculator centered below hero content with spacing */}
        <div className="w-full max-w-lg mx-auto mt-10 md:mt-16">
          <HeroCalculator />
        </div>
      </div>
    </div>
  );
};

export default Hero;
