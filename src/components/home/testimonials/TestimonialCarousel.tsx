
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TestimonialType } from './types';
import TestimonialCard from './TestimonialCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useInterval } from '@/hooks/useInterval';

interface TestimonialCarouselProps {
  testimonials: TestimonialType[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  autoplay: boolean;
  pauseAutoplay: () => void;
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  currentSlide,
  setCurrentSlide,
  autoplay,
  pauseAutoplay
}) => {
  return (
    <div className="px-4 mobile-optimized">
      <Carousel 
        className="w-full"
        onMouseEnter={pauseAutoplay}
        onTouchStart={pauseAutoplay}
        setApi={(api) => {
          if (api && currentSlide !== api.selectedScrollSnap()) {
            api.scrollTo(currentSlide);
          }
        }}
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <Button 
              key={index}
              variant="ghost"
              size="sm"
              className={`w-2 h-2 p-0 rounded-full ${
                currentSlide === index ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              onClick={() => {
                setCurrentSlide(index);
                pauseAutoplay();
              }}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default TestimonialCarousel;
