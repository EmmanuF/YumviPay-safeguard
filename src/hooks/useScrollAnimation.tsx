
import { useEffect, useRef } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollAnimation = ({ 
  threshold = 0.2, 
  rootMargin = "0px" 
}: UseScrollAnimationOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once the animation is triggered, we can unobserve the element
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );
    
    const currentRef = ref.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);
  
  return ref;
};
