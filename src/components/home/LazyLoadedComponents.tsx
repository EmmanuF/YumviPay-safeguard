
import React from 'react';
import { createLazyComponent } from '@/utils/lazyLoad';

// Lazily load non-critical sections of the homepage
export const LazyFeatures = createLazyComponent(
  () => import('./features/Features'),
  { height: '300px', message: 'Loading features...' }
);

export const LazyHowItWorks = createLazyComponent(
  () => import('./HowItWorks'),
  { height: '300px', message: 'Loading how it works...' }
);

export const LazyCountryCoverage = createLazyComponent(
  () => import('./CountryCoverage'),
  { height: '300px', message: 'Loading country coverage...' }
);

export const LazyTestimonials = createLazyComponent(
  () => import('./testimonials/Testimonials'),
  { height: '300px', message: 'Loading testimonials...' }
);

export const LazyAppDownload = createLazyComponent(
  () => import('./app-download'),
  { height: '300px', message: 'Loading app info...' }
);

export const LazyCTASection = createLazyComponent(
  () => import('./CTASection'),
  { height: '200px', message: 'Loading...' }
);
