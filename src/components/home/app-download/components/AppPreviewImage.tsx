
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

interface AppPreviewImageProps {
  animationSettings: any;
}

export const AppPreviewImage: React.FC<AppPreviewImageProps> = ({ animationSettings }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: animationSettings.duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
  
  // Function to handle image load retry
  const handleRetryLoad = () => {
    if (imageError) {
      setImageError(false);
      setImageLoading(true);
    }
  };
  
  return (
    <motion.div 
      className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto relative"
      variants={itemVariants}
    >
      {imageLoading && !imageError && (
        <ImageLoadingIndicator />
      )}
      
      {imageError && (
        <ImageErrorIndicator onRetry={handleRetryLoad} />
      )}
      
      <picture>
        <source 
          media="(max-width: 640px)" 
          srcSet="/lovable-uploads/e710d5d0-2d00-45ff-8867-6986425a2257.png?width=280"
        />
        <source 
          media="(max-width: 1024px)" 
          srcSet="/lovable-uploads/e710d5d0-2d00-45ff-8867-6986425a2257.png?width=320"
        />
        <source 
          media="(min-width: 1024px)" 
          srcSet="/lovable-uploads/e710d5d0-2d00-45ff-8867-6986425a2257.png?width=360"
        />
        <img 
          src="/lovable-uploads/e710d5d0-2d00-45ff-8867-6986425a2257.png" 
          alt="Yumvi-Pay Mobile App" 
          className={`w-full max-w-[320px] md:max-w-[400px] object-contain rounded-2xl ${imageError ? 'border border-red-300' : 'shadow-lg'}`}
          loading="eager" 
          width="400"
          height="580"
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            console.error('Image failed to load:', e);
            setImageLoading(false);
            setImageError(true);
            toast.error("Failed to load app preview image", {
              description: "Please check your internet connection",
              duration: 3000
            });
          }}
          style={{
            aspectRatio: '1/1',
            objectFit: 'contain',
            transform: imageError ? 'none' : 'translateY(0)'
          }}
        />
      </picture>
    </motion.div>
  );
};

const ImageLoadingIndicator: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-30 backdrop-blur-sm rounded-2xl">
    <div className="animate-pulse flex flex-col items-center">
      <div className="rounded-full bg-gray-200 h-12 w-12 mb-2"></div>
      <div className="h-2 w-24 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const ImageErrorIndicator: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div 
    className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-30 backdrop-blur-sm rounded-2xl cursor-pointer"
    onClick={onRetry}
  >
    <div className="flex flex-col items-center">
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry loading image
      </Button>
    </div>
  </div>
);
