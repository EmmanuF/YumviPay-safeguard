
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
    <div className="w-full bg-gradient-to-b from-indigo-700 to-secondary-600 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Hero content with the title and subtitle */}
          <HeroContent onGetStarted={handleGetStarted} />
          
          {/* Background decorative element */}
          <div className="absolute opacity-10 top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full bg-white blur-3xl"></div>
        </div>
      </div>
      
      {/* Calculator positioned below the hero content with negative margin for overlap */}
      <div className="w-full max-w-3xl mx-auto px-4 -mt-6 relative z-10">
        <HeroCalculator />
      </div>
    </div>
  );
};

export default Hero;
