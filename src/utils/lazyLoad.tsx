
import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadFallbackProps {
  height?: string | number;
  message?: string;
}

/**
 * Default fallback component shown during lazy loading
 */
export const LazyLoadFallback: React.FC<LazyLoadFallbackProps> = ({ 
  height = '200px',
  message = 'Loading...'
}) => {
  return (
    <div 
      className="flex flex-col items-center justify-center w-full bg-transparent animate-pulse"
      style={{ height }}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

/**
 * Create a lazily loaded component with customizable fallback
 * @param importFn Function that imports the component
 * @param fallback Optional custom fallback component
 * @param options Additional options for the lazy component
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode,
  options?: { timeout?: number }
) {
  const LazyComponent = lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <LazyLoadFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Utility to create a lazy loaded component with minimal boilerplate
 */
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallbackProps?: LazyLoadFallbackProps
) => {
  return lazyLoad(
    importFn,
    <LazyLoadFallback 
      height={fallbackProps?.height}
      message={fallbackProps?.message}
    />
  );
};
